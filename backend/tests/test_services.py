from app.services.ffmpeg_service import apply_color_grade


def test_color_grade_filter_selection():
    # Smoke-level assertion that function symbol is importable and callable.
    assert callable(apply_color_grade)
