# To export each object in .blend fild as a separate GLB file

import os
import bpy

export_directory = "/Export/Folder"

if not os.path.exists(export_directory):
    os.makedirs(export_directory)

def apply_all_modifiers(obj):
    bpy.context.view_layer.objects.active = obj
    for modifier in obj.modifiers:
        try:
            bpy.ops.object.modifier_apply(modifier=modifier.name)
        except RuntimeError as e:
            print(f"Failed to apply modifier {modifier.name} on {obj.name}: {e}")

for obj in bpy.context.scene.objects:
    if obj.type == 'MESH':
        obj_copy = obj.copy()
        obj_copy.data = obj.data.copy()
        bpy.context.collection.objects.link(obj_copy)
        
        apply_all_modifiers(obj_copy)
        original_location = obj_copy.location.copy()
        obj_copy.location = (0, 0, 0)

        filename = f"{obj.name}.glb"
        bpy.ops.object.select_all(action='DESELECT')
        obj_copy.select_set(True)
        
        bpy.ops.export_scene.gltf(
            filepath=os.path.join(export_directory, filename),
            export_format='GLB',
            use_selection=True,
            export_yup=True
        )

        bpy.data.objects.remove(obj_copy)

print("Export Done")