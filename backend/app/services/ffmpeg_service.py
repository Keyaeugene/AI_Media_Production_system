import os
import subprocess
import tempfile
from typing import List


def assemble_video(clip_paths: List[str], voiceover_path: str, output_path: str) -> str:
    with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as handle:
        for clip in clip_paths:
            handle.write(f"file '{os.path.abspath(clip)}'\n")
        concat_file = handle.name

    assembled_path = output_path.replace(".mp4", "_raw.mp4")
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            concat_file,
            "-c",
            "copy",
            assembled_path,
        ],
        check=True,
    )
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            assembled_path,
            "-i",
            voiceover_path,
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-shortest",
            output_path,
        ],
        check=True,
    )
    os.unlink(concat_file)
    os.unlink(assembled_path)
    return output_path


def apply_color_grade(input_path: str, output_path: str, mode: str = "educational") -> str:
    eq = (
        "eq=brightness=0.02:saturation=1.1:gamma_r=1.05:gamma_b=0.97"
        if mode == "educational"
        else "eq=brightness=0.01:saturation=1.05"
    )
    subprocess.run(
        ["ffmpeg", "-y", "-i", input_path, "-vf", eq, "-c:a", "copy", output_path],
        check=True,
    )
    return output_path
