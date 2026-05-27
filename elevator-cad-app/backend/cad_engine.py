from __future__ import annotations

from io import StringIO
from typing import Any

import ezdxf


REQUIRED_LAYERS = ["0", "Defpoints", "dim", "Tam", "Dchan", "11", "Dkhuat mo"]
OPTIONAL_LAYERS = ["PDF_0"]
DEFAULT_A = 1310.0
DEFAULT_B = 120.0
DEFAULT_C = 325.0


def _add_layers(doc: ezdxf.EzDxf) -> None:
    colors = {
        "dim": 1,
        "Tam": 4,
        "Dchan": 3,
        "11": 6,
        "Dkhuat mo": 8,
    }
    for name in [*REQUIRED_LAYERS, *OPTIONAL_LAYERS]:
        if name not in doc.layers:
            doc.layers.add(name, color=colors.get(name, 7))


def _line(msp: Any, start: tuple[float, float], end: tuple[float, float], layer: str = "0") -> None:
    msp.add_line(start, end, dxfattribs={"layer": layer})


def _poly(msp: Any, points: list[tuple[float, float]], layer: str = "0") -> None:
    msp.add_lwpolyline(points, close=True, dxfattribs={"layer": layer})


def _dim(
    msp: Any,
    base: tuple[float, float],
    p1: tuple[float, float],
    p2: tuple[float, float],
    *,
    angle: float,
    text: str = "<>",
) -> None:
    dimension = msp.add_linear_dim(
        base=base,
        p1=p1,
        p2=p2,
        angle=angle,
        text=text,
        dxfattribs={"layer": "dim"},
    )
    dimension.render()


def _ensure_sill_rib_block(doc: ezdxf.EzDxf) -> str:
    name = "DoorSillRib"
    if name in doc.blocks:
        return name

    block = doc.blocks.new(name=name)
    block.add_lwpolyline([(150, 0), (0, 0), (0, 107), (150, 107)], close=True)
    block.add_arc(center=(16.524, 53.5), radius=6.5, start_angle=90, end_angle=270)
    block.add_line((16.524, 47), (133.447, 47))
    block.add_line((133.447, 60), (16.524, 60))
    block.add_arc(center=(133.5, 53.5), radius=6.5, start_angle=270.479, end_angle=90.479)
    return name


def _ensure_start_bass_block(doc: ezdxf.EzDxf, b: float) -> str:
    name = "DoorStartBass"
    if name in doc.blocks:
        return name

    block = doc.blocks.new(name=name)
    block.add_lwpolyline([(65, 9), (265, 9), (265, b - 4), (65, b - 4)], close=True)
    block.add_lwpolyline([(82.456, 62.5), (82.456, 49.5), (225.779, 49.5), (225.779, 62.5)], close=True)
    return name


def generate_elevator_dxf(parts_data: list[dict[str, Any]]) -> str:
    doc = ezdxf.new("R2018")
    _add_layers(doc)
    msp = doc.modelspace()

    x_offset = 0.0
    for index, part in enumerate(parts_data):
        part_name = part.get("partName")
        params = part.get("parameters", {})
        a = float(params.get("A", DEFAULT_A))
        b = float(params.get("B", DEFAULT_B))
        c = float(params.get("C", DEFAULT_C))

        if part_name == "RailBracket":
            draw_rail_bracket(msp, a=a, b=b, x_offset=x_offset)
        elif part_name == "DoorStartBrace":
            draw_door_start_brace(msp, a=a, b=b, x_offset=x_offset)
        elif part_name == "DoorSillBrace":
            draw_door_sill_brace(msp, a=a, b=b, c=c, x_offset=x_offset)

        x_offset += max(a + 600.0, 1700.0)

    stream = StringIO()
    doc.write(stream)
    return stream.getvalue()


def draw_rail_bracket(msp: Any, *, a: float = DEFAULT_A, b: float = DEFAULT_B, x_offset: float = 0) -> None:
    left = x_offset
    right = x_offset + a

    def lx(offset: float) -> float:
        return left + offset

    def rx(offset: float) -> float:
        return right + offset

    # View 1: side/channel view. B stretches the vertical distances from the reference.
    y0 = 0.0
    y1 = y0 + 21.0
    y2 = y0 + 53.0
    y3 = y0 + b + 45.0
    y4 = y0 + b + 77.0
    y5 = y0 + b + 98.0

    _line(msp, (lx(0), y3), (rx(0), y3), "Dchan")
    _line(msp, (lx(0), y4), (rx(0), y4), "Dchan")
    _line(msp, (lx(33), y5), (rx(-33), y5))
    _line(msp, (lx(0), y2), (rx(0), y2), "Dchan")
    _line(msp, (lx(0), y1), (rx(0), y1), "Dchan")
    _line(msp, (lx(33), y0), (rx(-33), y0))
    _line(msp, (lx(0), y4), (lx(0), y3))
    _line(msp, (lx(0), y2), (lx(0), y1))
    _line(msp, (rx(0), y4), (rx(0), y3))
    _line(msp, (rx(0), y2), (rx(0), y1))
    _line(msp, (lx(33), y5), (lx(33), y4))
    _line(msp, (lx(33), y4), (lx(0), y4))
    _line(msp, (lx(33), y0), (lx(33), y1))
    _line(msp, (lx(33), y1), (lx(0), y1))
    _line(msp, (rx(-33), y0), (rx(-33), y1))
    _line(msp, (rx(-33), y1), (rx(0), y1))
    _line(msp, (rx(-33), y5), (rx(-33), y4))
    _line(msp, (rx(-33), y4), (rx(0), y4))
    _line(msp, (lx(0), y3), (lx(-4), y3))
    _line(msp, (lx(-4), y3), (lx(-4), y2))
    _line(msp, (lx(-4), y2), (lx(0), y2))
    _line(msp, (rx(0), y3), (rx(4), y3))
    _line(msp, (rx(4), y3), (rx(4), y2))
    _line(msp, (rx(4), y2), (rx(0), y2))

    _dim(msp, (lx(-120), y4), (lx(0), y3), (lx(0), y4), angle=90)
    _dim(msp, (lx(-120), y2), (lx(0), y3), (lx(0), y2), angle=90)
    _dim(msp, (lx(-120), y1), (lx(0), y2), (lx(0), y1), angle=90)
    _dim(msp, (rx(110), y0), (rx(-33), y5), (rx(-33), y0), angle=90)
    _dim(msp, (lx(0), y0 - 100), (rx(0), y1), (lx(0), y1), angle=0)
    _dim(msp, (lx(0), y3 - 41), (lx(-4), y3), (lx(0), y3), angle=0)
    _dim(msp, (lx(-43), y4), (lx(33), y5), (lx(33), y4), angle=90)
    _dim(msp, (lx(-43), y1), (lx(33), y0), (lx(33), y1), angle=90)

    # View 2: front view.
    v2 = 435.0
    z0 = v2
    z1 = v2 + 4.0
    z2 = v2 + 24.0
    z3 = v2 + 35.0
    z4 = v2 + 85.0
    z5 = v2 + b - 24.0
    z6 = v2 + b - 4.0
    z7 = v2 + b

    _line(msp, (lx(0), z0), (rx(0), z0))
    _line(msp, (lx(33), z2), (rx(-33), z2))
    _line(msp, (lx(0), z1), (rx(0), z1), "Dkhuat mo")
    _line(msp, (lx(0), z7), (rx(0), z7))
    _line(msp, (lx(33), z5), (rx(-33), z5))
    _line(msp, (lx(0), z6), (rx(0), z6), "Dkhuat mo")
    _line(msp, (rx(30), z4), (rx(-32), z4), "Tam")
    _line(msp, (rx(30), z3), (rx(-32), z3), "Tam")
    _line(msp, (lx(5), z6), (lx(5), z1))
    _line(msp, (rx(-5), z6), (rx(-5), z1))
    _line(msp, (rx(0), z7), (rx(0), z0))
    _line(msp, (lx(0), z7), (lx(0), z0))
    _line(msp, (lx(31), z4), (lx(-32), z4), "Tam")
    _line(msp, (lx(31), z3), (lx(-32), z3), "Tam")
    _line(msp, (lx(33), z6), (lx(0), z6))
    _line(msp, (lx(33), z1), (lx(0), z1))
    _line(msp, (rx(-33), z1), (rx(0), z1))
    _line(msp, (rx(-33), z5), (rx(-33), z6))
    _line(msp, (rx(-33), z6), (rx(0), z6))
    _line(msp, (rx(-33), z2), (rx(-33), z1))
    _line(msp, (lx(33), z5), (lx(33), z6))
    _line(msp, (lx(33), z2), (lx(33), z1))

    _dim(msp, (lx(-80), z0), (lx(0), z7), (lx(0), z0), angle=90)
    _dim(msp, (lx(0), z0 - 97), (rx(0), z0), (lx(0), z0), angle=0)

    # View 3: top view.
    v3 = 860.0
    t0 = v3
    t1 = v3 + 4.0
    t2 = v3 + 36.0
    t3 = v3 + 40.0

    _line(msp, (rx(4), t3), (lx(-4), t3))
    _line(msp, (rx(0), t2), (lx(0), t2), "Dkhuat mo")
    _line(msp, (rx(-33), t0), (lx(33), t0))
    _line(msp, (rx(0), t1), (lx(0), t1), "Dkhuat mo")
    _line(msp, (lx(0), t2), (lx(0), t1))
    _line(msp, (rx(0), t2), (rx(0), t1))
    _line(msp, (rx(0), t1), (rx(-33), t1))
    _line(msp, (rx(-33), t1), (rx(-33), t0))
    _line(msp, (lx(0), t1), (lx(33), t1))
    _line(msp, (lx(33), t1), (lx(33), t0))
    _line(msp, (lx(-4), t3), (lx(0), t2))
    _line(msp, (rx(0), t2), (rx(4), t3))
    _line(msp, (lx(5), t2), (lx(5), t1), "11")
    _line(msp, (rx(-5), t2), (rx(-5), t1), "11")

    _dim(msp, (lx(0), t0 - 116), (rx(0), t1), (lx(0), t1), angle=0)
    _dim(msp, (lx(-83), t3), (lx(33), t0), (lx(33), t3), angle=90)


def _draw_brace_base(msp: Any, *, a: float, b: float, x_offset: float) -> tuple[Any, Any, dict[str, float]]:
    left = x_offset
    right = x_offset + a

    def lx(offset: float) -> float:
        return left + offset

    def rx(offset: float) -> float:
        return right + offset

    y0 = 0.0
    y1 = y0 + 21.0
    y2 = y0 + 53.0
    y3 = y0 + b + 45.0
    y4 = y0 + b + 77.0
    y5 = y0 + b + 98.0

    _line(msp, (lx(0), y3), (rx(0), y3), "Dchan")
    _line(msp, (lx(0), y4), (rx(0), y4), "Dchan")
    _line(msp, (lx(33), y5), (rx(-33), y5))
    _line(msp, (lx(0), y2), (rx(0), y2), "Dchan")
    _line(msp, (lx(0), y1), (rx(0), y1), "Dchan")
    _line(msp, (lx(33), y0), (rx(-33), y0))
    _line(msp, (lx(0), y4), (lx(0), y3))
    _line(msp, (lx(0), y2), (lx(0), y1))
    _line(msp, (rx(0), y4), (rx(0), y3))
    _line(msp, (rx(0), y2), (rx(0), y1))
    _line(msp, (lx(33), y5), (lx(33), y4))
    _line(msp, (lx(33), y4), (lx(0), y4))
    _line(msp, (lx(33), y0), (lx(33), y1))
    _line(msp, (lx(33), y1), (lx(0), y1))
    _line(msp, (rx(-33), y0), (rx(-33), y1))
    _line(msp, (rx(-33), y1), (rx(0), y1))
    _line(msp, (rx(-33), y5), (rx(-33), y4))
    _line(msp, (rx(-33), y4), (rx(0), y4))
    _line(msp, (lx(0), y3), (lx(-4), y3))
    _line(msp, (lx(-4), y3), (lx(-4), y2))
    _line(msp, (lx(-4), y2), (lx(0), y2))
    _line(msp, (rx(0), y3), (rx(4), y3))
    _line(msp, (rx(4), y3), (rx(4), y2))
    _line(msp, (rx(4), y2), (rx(0), y2))

    _dim(msp, (lx(-92), y4), (lx(0), y3), (lx(0), y4), angle=90)
    _dim(msp, (lx(-92), y2), (lx(0), y3), (lx(0), y2), angle=90)
    _dim(msp, (lx(-92), y1), (lx(0), y2), (lx(0), y1), angle=90)
    _dim(msp, (rx(77), y0), (rx(-33), y5), (rx(-33), y0), angle=90)
    _dim(msp, (lx(0), y0 - 92), (rx(0), y1), (lx(0), y1), angle=0)
    _dim(msp, (lx(0), y3 - 41), (lx(-4), y3), (lx(0), y3), angle=0)
    _dim(msp, (lx(-31), y5), (lx(33), y4), (lx(33), y5), angle=90)
    _dim(msp, (lx(-31), y0), (lx(33), y1), (lx(33), y0), angle=90)

    v2 = 435.0
    z0 = v2
    z1 = v2 + 4.0
    z2 = v2 + 24.0
    z3 = v2 + 35.0
    z4 = v2 + 85.0
    z5 = v2 + b - 24.0
    z6 = v2 + b - 4.0
    z7 = v2 + b

    _line(msp, (lx(0), z0), (rx(0), z0))
    _line(msp, (lx(33), z2), (rx(-33), z2))
    _line(msp, (lx(0), z1), (rx(0), z1), "Dkhuat mo")
    _line(msp, (lx(0), z7), (rx(0), z7))
    _line(msp, (lx(33), z5), (rx(-33), z5))
    _line(msp, (lx(0), z6), (rx(0), z6), "Dkhuat mo")
    _line(msp, (lx(5), z6), (lx(5), z1))
    _line(msp, (rx(-5), z6), (rx(-5), z1))
    _line(msp, (rx(0), z7), (rx(0), z0))
    _line(msp, (lx(0), z7), (lx(0), z0))
    _line(msp, (lx(33), z5), (lx(33), z6))
    _line(msp, (lx(33), z6), (lx(0), z6))
    _line(msp, (lx(33), z2), (lx(33), z1))
    _line(msp, (rx(-33), z2), (rx(-33), z1))
    _line(msp, (rx(-33), z1), (rx(0), z1))
    _line(msp, (rx(-33), z6), (rx(0), z6))
    _line(msp, (rx(-33), z5), (rx(-33), z6))
    _line(msp, (lx(33), z1), (lx(0), z1))

    _dim(msp, (lx(-107), z0), (lx(0), z7), (lx(0), z0), angle=90)
    _dim(msp, (rx(0), z7 + 92), (lx(0), z7), (rx(0), z7), angle=0)

    v3 = 860.0
    t0 = v3
    t1 = v3 + 4.0
    t2 = v3 + 36.0
    t3 = v3 + 40.0

    _line(msp, (rx(4), t3), (lx(-4), t3))
    _line(msp, (rx(0), t2), (lx(0), t2), "Dkhuat mo")
    _line(msp, (rx(-33), t0), (lx(33), t0))
    _line(msp, (rx(0), t1), (lx(0), t1), "Dkhuat mo")
    _line(msp, (lx(0), t2), (lx(0), t1))
    _line(msp, (rx(0), t2), (rx(0), t1))
    _line(msp, (rx(0), t1), (rx(-33), t1))
    _line(msp, (rx(-33), t1), (rx(-33), t0))
    _line(msp, (lx(0), t1), (lx(33), t1))
    _line(msp, (lx(33), t1), (lx(33), t0))
    _line(msp, (lx(-4), t3), (lx(0), t2))
    _line(msp, (rx(0), t2), (rx(4), t3))
    _line(msp, (lx(5), t2), (lx(5), t1), "11")
    _line(msp, (rx(-5), t2), (rx(-5), t1), "11")

    _dim(msp, (rx(4), t3 + 82), (lx(-4), t3), (rx(4), t3), angle=0)

    return lx, rx, {
        "z0": z0,
        "z1": z1,
        "z2": z2,
        "z3": z3,
        "z4": z4,
        "z5": z5,
        "z6": z6,
        "z7": z7,
    }


def draw_door_start_brace(msp: Any, *, a: float = DEFAULT_A, b: float = DEFAULT_B, x_offset: float = 0) -> None:
    lx, rx, y = _draw_brace_base(msp, a=a, b=b, x_offset=x_offset)
    z0 = y["z0"]
    z1 = y["z1"]
    z6 = y["z6"]
    mid = (lx(0) + rx(0)) / 2
    block_name = _ensure_start_bass_block(msp.doc, b)

    msp.add_blockref(block_name, (lx(0), z0), dxfattribs={"layer": "0"})
    msp.add_blockref(block_name, (rx(0), z0), dxfattribs={"layer": "0", "xscale": -1})
    _poly(msp, [(mid - 2.5, z1 + 2), (mid + 2.5, z1 + 2), (mid + 2.5, z6), (mid - 2.5, z6)], "PDF_0")

    msp.add_leader([(mid + 2.5, z1 + 49.628), (mid + 164, z0 - 101), (mid + 181, z0 - 101)], dxfattribs={"layer": "dim"})
    msp.add_mtext("HÀN GÂN", dxfattribs={"layer": "dim", "insert": (mid + 186, z0 - 69)})

    _dim(msp, (lx(265), z0 - 76), (lx(65), z1 + 5), (lx(265), z1 + 5), angle=0)
    _dim(msp, (lx(0), z0 - 76), (lx(65), z0), (lx(0), z0), angle=0)
    _dim(msp, (rx(-265), z0 - 76), (rx(-65), z1 + 5), (rx(-265), z1 + 5), angle=180)
    _dim(msp, (rx(-65), z0 - 76), (rx(0), z0), (rx(-65), z0), angle=0)
    _dim(msp, (lx(-65), 900), (lx(33), 860), (lx(33), 900), angle=90)


def draw_door_sill_brace(
    msp: Any,
    *,
    a: float = DEFAULT_A,
    b: float = DEFAULT_B,
    c: float = DEFAULT_C,
    x_offset: float = 0,
) -> None:
    lx, _rx, y = _draw_brace_base(msp, a=a, b=b, x_offset=x_offset)
    z0 = y["z0"]
    z1 = y["z1"]
    z6 = y["z6"]
    block_name = _ensure_sill_rib_block(msp.doc)

    first = lx(255)
    inserts = [first, first + c, first + c * 2]
    for insert_x in inserts:
        msp.add_blockref(block_name, (insert_x, z0 + 9), dxfattribs={"layer": "PDF_0"})

    _dim(msp, (inserts[1] + 75, z6 + 50), (inserts[0] + 75, z6), (inserts[1] + 75, z6), angle=0)
    _dim(msp, (inserts[2] + 75, z6 + 50), (inserts[1] + 75, z6), (inserts[2] + 75, z6), angle=0)
    for insert_x in inserts:
        _dim(msp, (insert_x + 150, z0 - 82), (insert_x, z0 + 9), (insert_x + 150, z0 + 9), angle=0)
