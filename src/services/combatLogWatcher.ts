import { useCallback, useEffect, useRef, useState } from 'react';
import { SAMPLE_DRAKHEIM_COMBAT_LOG } from '../domain/sampleCombatStream';

interface DirectoryHandleLike {
  name: string;
  values(): AsyncIterable<{
    kind: 'file' | 'directory';
    name: string;
    getFile?: () => Promise<File>;
  }>;
}

declare global {
  interface Window {
    showDirectoryPicker?: (options?: { mode?: 'read' | 'readwrite' }) => Promise<DirectoryHandleLike>;
  }
}

export interface LogWatcherController {
  mode: 'idle' | 'watching-folder' | 'simulating';
  watchedFolderName: string | null;
  activeLogFileName: string | null;
  linesProcessed: number;
  supportsDirectoryPicker: boolean;
  errorMessage: string | null;
  startFolderWatch: () => Promise<boolean>;
  stopWatch: () => void;
  startSampleSimulation: () => void;
  importLogFile: (file: File) => Promise<void>;
}

const STRUCTURAL_LOG_EVENT_RE =
  /\|(ZONE_CHANGE|DUNGEON_START|DUNGEON_END|COMBATANT_INFO|ENCOUNTER_START|ENCOUNTER_END|UNIT_DEATH|ALLY_DEATH|ABILITY_ACTIVATED|ABILITY_CAST_START)\|/;

function compactReplayChunk(rawText: string, dropPartialFirstLine: boolean): string[] {
  const split = rawText.split(/\r?\n/);
  if (dropPartialFirstLine && split.length > 1) {
    split.shift();
  }
  const nonEmpty = split.filter((l) => l.trim().length > 0);
  if (nonEmpty.length === 0) return [];

  let startIdx = 0;
  for (let i = nonEmpty.length - 1; i >= 0; i--) {
    if (nonEmpty[i].includes('|DUNGEON_START|')) {
      startIdx = i;
      // Include preceding ZONE_CHANGE if immediately before DUNGEON_START
      if (i > 0 && nonEmpty[i - 1].includes('|ZONE_CHANGE|')) {
        startIdx = i - 1;
      }
      break;
    }
  }

  const scoped = nonEmpty.slice(startIdx);
  if (scoped.length <= 500) return scoped;

  const head = scoped.slice(0, -240).filter((line) => STRUCTURAL_LOG_EVENT_RE.test(line));
  const tail = scoped.slice(-240);
  return [...head, ...tail];
}

export function useCombatLogWatcher(
  onLines: (lines: string[]) => void,
  onWatchingChange: (watching: boolean) => void
): LogWatcherController {
  const [mode, setMode] = useState<'idle' | 'watching-folder' | 'simulating'>('idle');
  const [watchedFolderName, setWatchedFolderName] = useState<string | null>(null);
  const [activeLogFileName, setActiveLogFileName] = useState<string | null>(null);
  const [linesProcessed, setLinesProcessed] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dirHandleRef = useRef<DirectoryHandleLike | null>(null);
  const trackedNameRef = useRef<string | null>(null);
  const byteOffsetRef = useRef<number>(0);
  const carryLineRef = useRef<string>('');
  const timerRef = useRef<number | null>(null);

  const supportsDirectoryPicker =
    typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function';

  const clearTimers = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopWatch = useCallback(() => {
    clearTimers();
    dirHandleRef.current = null;
    trackedNameRef.current = null;
    byteOffsetRef.current = 0;
    carryLineRef.current = '';
    setMode('idle');
    onWatchingChange(false);
  }, [clearTimers, onWatchingChange]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const pollDirectoryOnce = useCallback(async () => {
    const dir = dirHandleRef.current;
    if (!dir) return;

    let newestFile: File | null = null;
    for await (const entry of dir.values()) {
      if (entry.kind !== 'file' || !entry.getFile) continue;
      if (!/combatlog.*\.txt$/i.test(entry.name)) continue;
      const f = await entry.getFile();
      if (!newestFile || f.lastModified > newestFile.lastModified) {
        newestFile = f;
      }
    }

    if (!newestFile) return;

    if (newestFile.name !== trackedNameRef.current) {
      trackedNameRef.current = newestFile.name;
      setActiveLogFileName(newestFile.name);
      // Scan up to 6MB back on initial attach so DUNGEON_START, COMBATANT_INFO (2 relics + gem modifiers),
      // and 5-6m Relic cooldown casts earlier in the run are always captured.
      const initialStart = Math.max(0, newestFile.size - 6 * 1024 * 1024);
      const initialText = await newestFile.slice(initialStart, newestFile.size).text();
      byteOffsetRef.current = newestFile.size;
      carryLineRef.current = '';
      const initialLines = compactReplayChunk(initialText, initialStart > 0);
      if (initialLines.length > 0) {
        setLinesProcessed((c) => c + initialLines.length);
        onLines(initialLines);
      }
      return;
    }

    if (newestFile.size <= byteOffsetRef.current) return;

    const slice = newestFile.slice(byteOffsetRef.current, newestFile.size);
    byteOffsetRef.current = newestFile.size;

    const chunkText = await slice.text();
    const combined = carryLineRef.current + chunkText;
    const rawLines = combined.split(/\r?\n/);
    carryLineRef.current = rawLines.pop() ?? '';

    const valid = rawLines.filter((l) => l.trim().length > 0);
    if (valid.length > 0) {
      setLinesProcessed((c) => c + valid.length);
      onLines(valid);
    }
  }, [onLines]);

  const startFolderWatch = useCallback(async (): Promise<boolean> => {
    setErrorMessage(null);
    if (!window.showDirectoryPicker) {
      setErrorMessage(
        'Your browser does not expose showDirectoryPicker. Use Chrome/Edge or run `npm run tail-logs`.'
      );
      return false;
    }

    try {
      const dirHandle = await window.showDirectoryPicker({ mode: 'read' });
      clearTimers();
      dirHandleRef.current = dirHandle;
      trackedNameRef.current = null;
      byteOffsetRef.current = 0;
      carryLineRef.current = '';
      setWatchedFolderName(dirHandle.name);
      setMode('watching-folder');
      onWatchingChange(true);

      await pollDirectoryOnce();
      timerRef.current = window.setInterval(() => {
        void pollDirectoryOnce();
      }, 550);
      return true;
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') {
        setErrorMessage('Could not access CombatLogs folder.');
      }
      return false;
    }
  }, [clearTimers, onWatchingChange, pollDirectoryOnce]);

  const startSampleSimulation = useCallback(() => {
    clearTimers();
    setErrorMessage(null);
    setWatchedFolderName('Saved/CombatLogs (Simulated)');
    setActiveLogFileName('CombatLog_2026-11-15_Drakheim_E16.txt');
    setLinesProcessed(0);
    setMode('simulating');
    onWatchingChange(true);

    let cursor = 0;
    const step = () => {
      if (cursor >= SAMPLE_DRAKHEIM_COMBAT_LOG.length) {
        clearTimers();
        setMode('idle');
        onWatchingChange(false);
        return;
      }
      const batch = SAMPLE_DRAKHEIM_COMBAT_LOG.slice(cursor, cursor + 2);
      cursor += batch.length;
      setLinesProcessed((c) => c + batch.length);
      onLines([...batch]);
    };

    step();
    timerRef.current = window.setInterval(step, 900);
  }, [clearTimers, onLines, onWatchingChange]);

  const importLogFile = useCallback(
    async (file: File) => {
      setErrorMessage(null);
      setActiveLogFileName(file.name);
      const start = Math.max(0, file.size - 6 * 1024 * 1024);
      const text = await file.slice(start, file.size).text();
      const lines = compactReplayChunk(text, start > 0);
      setLinesProcessed((c) => c + lines.length);
      onLines(lines);
    },
    [onLines]
  );

  return {
    mode,
    watchedFolderName,
    activeLogFileName,
    linesProcessed,
    supportsDirectoryPicker,
    errorMessage,
    startFolderWatch,
    stopWatch,
    startSampleSimulation,
    importLogFile,
  };
}
