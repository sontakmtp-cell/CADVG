from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field

from cad_engine import DEFAULT_A, DEFAULT_B, generate_elevator_dxf


class RailBracketParameters(BaseModel):
    A: float = Field(default=DEFAULT_A, gt=0)
    B: float = Field(default=DEFAULT_B, gt=0)


class PartRequest(BaseModel):
    partName: str
    parameters: RailBracketParameters


class ExportRequest(BaseModel):
    parts: list[PartRequest]


app = FastAPI(title="Elevator CAD MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/export-dxf")
def export_dxf(payload: ExportRequest) -> Response:
    dxf_text = generate_elevator_dxf([part.model_dump() for part in payload.parts])
    return Response(
        content=dxf_text,
        media_type="application/dxf",
        headers={"Content-Disposition": 'attachment; filename="rail-bracket.dxf"'},
    )
