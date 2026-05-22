export type JobStatus = "pending" | "running" | "reviewing" | "completed" | "failed";
export type ContentMode = "educational" | "commercial";
export type InputType = "theme" | "brief" | "script";

export interface Job {
  id: string;
  status: JobStatus;
  mode: ContentMode;
  current_step: string | null;
  final_video_url: string | null;
  error_message: string | null;
  created_at: string;
}

export interface JobCreate {
  mode: ContentMode;
  input_type: InputType;
  input_text: string;
  reference_urls?: string[];
}

export interface Asset {
  id: string;
  job_id: string;
  asset_type: "script" | "prompt" | "image" | "video_clip" | "voiceover" | "final_video";
  beat_index: number | null;
  storage_url: string;
}

export interface LogMessage {
  agent: string;
  message: string;
  level: "info" | "warn" | "error";
  timestamp: string;
}
