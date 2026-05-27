# ROLE AND OBJECTIVE
Build a local MVP web application for one elevator mechanical part: `Rail bracket`.

The app lets the user enter two parameters, `A` and `B`, previews the stretched part in SVG, and exports a DXF that matches the structure of `template/Drawing1.dxf` as closely as possible for the MVP.

The MVP must be simple and reliable first. Do not add multi-part expansion, accounts, database, advanced CAD editing, or speculative configuration.

# SOURCE OF TRUTH
- CAD reference file: `template/Drawing1.dxf`.
- MVP part: `Rail bracket`.
- Exported DXF must contain the same 3-view drawing layout as the reference file.
- Exported DXF must use real DXF `DIMENSION` entities for dimensions, not lines plus text.
- Dimension placement should follow the reference file.
- Exported DXF must include the required drawing layers from the reference file, including at least:
  - `dim`
  - `Dchan`
  - `Dkhuat mo`
  - `Tam`
  - `0`
  - `11`
  - `Defpoints`

Current reference inspection notes:
- Modelspace contains `60` `LINE` entities and `12` real `DIMENSION` entities.
- The layer table contains: `0`, `Defpoints`, `dim`, `Tam`, `Dchan`, `11`, `Dkhuat mo`.
- Dimension labels/values represented by the current reference include: `A`, `B`, `B-8`, `B+98`, `32`, `21`, `4`, and `40`.
- Preserve symbolic dimension text overrides from the template where present, such as `A`, `B`, `B-8`, and `B+98`.

# MVP PARAMETRIC SCOPE
Only two user-editable parameters are required for the first version:
- `A`: horizontal stretch parameter for the dimensions labeled `A` in the reference DXF. In the current template, the default `A` measurement is `1310`.
- `B`: vertical stretch parameter for the dimension labeled `B` in the reference DXF. In the current template, the default `B` measurement is `120`.

All other offsets, gaps, small notches, hidden lines, center lines, and dimension offsets should be derived from the reference geometry and kept as fixed template relationships unless they must move to preserve the stretched shape.

Do not invent extra part parameters in the MVP. Extra inputs such as material, quantity, hole diameter, hole spacing, surface treatment, and notes are deferred until after the first part is correct.

# TECH STACK
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Python + FastAPI + Uvicorn
- CAD library: `ezdxf`
- Deployment: local machine only

# WORKSPACE LAYOUT
Create:
```text
elevator-cad-app/
  backend/
  frontend/
```

# BACKEND REQUIREMENTS
Create a FastAPI backend with:
- `GET /` health check.
- `POST /api/export-dxf` for DXF export.

Request payload:
```json
{
  "parts": [
    {
      "partName": "RailBracket",
      "parameters": {
        "A": 1310,
        "B": 120
      }
    }
  ]
}
```

DXF generation rules:
- Use `ezdxf`.
- Generate one `RailBracket` drawing per requested part.
- Draw all requested parts in the same modelspace.
- If multiple parts are sent later, place them side-by-side horizontally with spacing.
- For MVP, implement and verify one part first.
- Recreate the 3-view layout from `template/Drawing1.dxf`.
- Add real dimension entities with `ezdxf`, not fake dimensions made from `LINE` and `TEXT`.
- Preserve or recreate required layers.
- Keep frontend SVG math and backend DXF math in sync.

# FRONTEND REQUIREMENTS
Create a React app with:
- Top bar with `Export DXF`.
- Sidebar with a single active tab: `Rail bracket`.
- Main split view:
  - left panel: inputs for `A` and `B`
  - right panel: inline SVG preview
- SVG preview must update immediately when `A` or `B` changes.
- SVG preview should visually represent the same 3-view layout as the DXF, but SVG preview dimensions are visual annotations only. The "real dimension entity" requirement applies to the exported DXF.

Concept image for UI direction, not strict implementation:
`C:\Users\Admin\.codex\generated_images\019e674d-126e-7f83-83a2-a0ca7a8146aa\ig_083f673e6dbf1007016a1659ecc7a481919e17d73f30482cf4.png`

# STEP-BY-STEP EXECUTION PLAN

## Step 1: Inspect Reference DXF
Goal: extract the reference geometry needed to build the MVP without guessing.

Actions:
- Read `template/Drawing1.dxf` with `ezdxf`.
- List modelspace entities by type and layer.
- Identify the 3 view groups.
- Identify existing `DIMENSION` entities and their measurement/placement.
- Record the fixed relationships that should remain constant when `A` and `B` change.

Verify:
- Produce a short geometry summary before coding the generator.
- Confirm the reference contains real `DIMENSION` entities.
- Confirm the current reference contains `12` modelspace `DIMENSION` entities.
- Confirm required layers are known.

## Step 2: Backend Setup
Goal: create the smallest backend that can run locally.

Actions:
- Create `elevator-cad-app/backend`.
- Create a Python virtual environment.
- Install `fastapi`, `uvicorn`, `ezdxf`, and `pydantic`.
- Create `main.py`.
- Enable CORS for local Vite origins.
- Add `GET /`.

Verify:
- Run the backend with Uvicorn.
- Call `GET /` successfully.

## Step 3: Rail Bracket DXF Generator
Goal: generate a valid DXF for one `RailBracket` using `A` and `B`.

Actions:
- Create `cad_engine.py`.
- Implement `generate_elevator_dxf(parts_data)`.
- Implement `draw_rail_bracket(msp, params, x_offset=0)`.
- Recreate all 3 reference views.
- Add real dimension entities for all dimensions represented in the reference drawing.
- Recreate required layers.
- Return the DXF as a downloadable file response from `POST /api/export-dxf`.

Verify:
- Export a DXF with default `A=1310`, `B=120`.
- Re-open the exported DXF with `ezdxf`.
- Confirm modelspace contains expected `LINE`/geometry entities.
- Confirm modelspace contains real `DIMENSION` entities.
- Confirm required layers exist.
- Confirm no dimensions are faked with text-only labels.

## Step 4: Frontend Setup
Goal: create the minimum React app shell.

Actions:
- Create `elevator-cad-app/frontend` using Vite React TypeScript.
- Install `axios`, `tailwindcss`, and `lucide-react`.
- Configure Tailwind.
- Create simple folders for `components` and `types`.

Verify:
- Run `npm run dev`.
- Open the app locally.
- Confirm there are no console/build errors.

## Step 5: Frontend Rail Bracket Editor
Goal: make `A` and `B` editable and preview the part.

Actions:
- Define TypeScript types for `RailBracket`.
- Create the `Rail bracket` tab.
- Create numeric inputs for `A` and `B`.
- Create an inline SVG preview with the same parametric math used by the backend.
- Create `Export DXF` button that calls `POST /api/export-dxf` and downloads the result.

Verify:
- Changing `A` stretches the drawing horizontally.
- Changing `B` stretches the drawing vertically.
- Export downloads a DXF.
- Backend receives numeric values, not uncast strings.

## Step 6: Integration And Local Launch
Goal: verify the full local workflow end-to-end.

Actions:
- Run backend and frontend together.
- Export a DXF from the browser.
- Re-open the exported file with `ezdxf` to check layers and dimensions.

Verify:
- App URL is available locally.
- API call succeeds without CORS errors.
- Exported DXF contains 3 views.
- Exported DXF contains real `DIMENSION` entities.
- Exported DXF contains required layers.

# NON-GOALS FOR MVP
- No multiple real part types yet.
- No database.
- No user accounts.
- No editing arbitrary CAD entities.
- No SVG export.
- No material/quantity/surface treatment workflow.
- No automatic inference of unknown CAD rules beyond the reference file.

# IMPORTANT IMPLEMENTATION NOTES
- Keep changes small and traceable to this plan.
- If geometry from the reference file is ambiguous, stop and ask Khầy before inventing a rule.
- Keep comments short and only where they explain non-obvious parametric math.
- Use simple code over broad abstractions.
- Validate after every step before continuing.
