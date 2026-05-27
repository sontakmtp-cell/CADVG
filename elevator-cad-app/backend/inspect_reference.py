from collections import Counter
from pathlib import Path

import ezdxf


doc = ezdxf.readfile(Path(__file__).resolve().parents[2] / "template" / "Drawing1.dxf")
msp = doc.modelspace()

print("Layers:", [layer.dxf.name for layer in doc.layers])
print("Modelspace entities:", dict(Counter(entity.dxftype() for entity in msp)))
print("Entities by type/layer:")
for key, count in sorted(Counter((entity.dxftype(), entity.dxf.layer) for entity in msp).items()):
    print(f"  {key[0]} {key[1]}: {count}")

print("Dimensions:")
for index, entity in enumerate(msp.query("DIMENSION"), start=1):
    print(index, entity.dxf.layer, repr(entity.dxf.text), round(entity.get_measurement(), 3))
