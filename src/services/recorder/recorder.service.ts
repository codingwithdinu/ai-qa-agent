import { logger } from "../../utils/logger";
import prisma from "../../config/database";
import { RecordingEvent } from "../../types/recording.types";
import { v4 as uuid } from "uuid";
import { chromium, Browser, Page } from "playwright";
import fs from "fs";
import path from "path";

let browser: Browser | null = null;
let page: Page | null = null;

/**
 * Start recording browser session
 */
export async function startRecording(
  sessionId: string,
  url: string,
): Promise<string> {
  try {
    const recordingId = uuid();

    const recording = await prisma.recording.create({
      data: {
        id: recordingId,
        sessionId,
        url,
        events: JSON.stringify([]),
      },
    });

    logger.info(`Recording started: ${recordingId}`, {
      sessionId,
      url,
    });

    /**
     * Launch Playwright Browser
     */
    browser = await chromium.launch({
      headless: false,
    });

    const context = await browser.newContext();

    /**
     * Inject recorder globally
     */
    const injectorPath = path.resolve(
      process.cwd(),
      "src",
      "services",
      "recorder",
      "injector.js",
    );

    console.log("Injector Path:", injectorPath);

    const script = fs.readFileSync(injectorPath, "utf-8");

    /**
     * Create page AFTER injection
     */
    page = await context.newPage();

    /**
     * Open target URL
     */
    await page.goto(url);

    await page.evaluate((id) => {
      (window as any).__recordingId = id;
    }, recordingId);

    await page.evaluate(script);

    logger.info("🎥 Playwright browser launched");

    return recordingId;
  } catch (error: any) {
    logger.error("Failed to start recording", error);
    throw error;
  }
}

/**
 * Add event to recording
 */
export async function addEventToRecording(
  recordingId: string,
  event: RecordingEvent,
): Promise<void> {
  try {
    const recording = await prisma.recording.findUnique({
      where: { id: recordingId },
    });

    if (!recording) {
      throw new Error("Recording not found");
    }

    const events = JSON.parse(recording.events || "[]") as RecordingEvent[];
    events.push(event);

    await prisma.recording.update({
      where: { id: recordingId },
      data: { events: JSON.stringify(events) },
    });

    logger.debug(`Event added to recording ${recordingId}`, event);
  } catch (error: any) {
    logger.error("Failed to add event to recording", error);
  }
}

/**
 * Stop recording
 */
export async function stopRecording(recordingId: string): Promise<any> {
  try {
    const recording = await prisma.recording.findUnique({
      where: { id: recordingId },
    });

    if (!recording) {
      throw new Error("Recording not found");
    }

    const events = JSON.parse(recording.events || "[]") as RecordingEvent[];

    logger.info(`Recording stopped: ${recordingId}`, {
      totalEvents: events.length,
    });

    /**
     * Close browser
     */
    if (browser) {
      await browser.close();
      browser = null;
      page = null;
    }

    return recording;
  } catch (error: any) {
    logger.error("Failed to stop recording", error);
    throw error;
  }
}

/**
 * Get recording by ID
 */
export async function getRecording(recordingId: string): Promise<any> {
  try {
    return await prisma.recording.findUnique({ where: { id: recordingId } });
  } catch (error: any) {
    logger.error("Failed to get recording", error);
    throw error;
  }
}

/**
 * List all recordings
 */
export async function listRecordings(): Promise<any[]> {
  try {
    const recordings = await prisma.recording.findMany({
      orderBy: { createdAt: "desc" },
    });
    return recordings.map((recording: any) => ({
      ...recording,
      events: JSON.parse(recording.events || "[]"),
    }));
  } catch (error: any) {
    logger.error("Failed to list recordings", error);
    return [];
  }
}

export default {
  startRecording,
  addEventToRecording,
  stopRecording,
  getRecording,
  listRecordings,
};
