from dataclasses import dataclass


@dataclass
class OrchestratorContext:
    job_id: str
    mode: str
    input_type: str
    input_text: str
