from app.agents.reviewer_agent import create_reviewer_agent
from app.agents.script_agent import create_script_agent


def test_script_agent_creation():
    agent = create_script_agent()
    assert agent.role == "Content Strategist & Script Writer"
    assert "script" in agent.goal.lower()


def test_reviewer_agent_creation():
    agent = create_reviewer_agent()
    assert ">= 9" in agent.goal or "9" in agent.goal
