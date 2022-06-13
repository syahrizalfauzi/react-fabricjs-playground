import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";
import "./App.css";
import React, { useEffect, useMemo, useState } from "react";
import Design from "./types/design";

export default function App() {
  const { editor, onReady } = useFabricJSEditor();
  const [designs, setDesigns] = useState<Design[]>([]);
  const selectedObject = useMemo(() => {
    return editor?.canvas.getActiveObject();
  }, [editor?.canvas.getActiveObjects()]);

  const handleAddCircle = () => {
    editor?.addCircle();
  };
  const handleAddRectangle = () => {
    editor?.addRectangle();
  };
  const handleAddImage = () => {
    fabric.Image.fromURL("https://picsum.photos/seed/picsum/200", (image) => {
      editor?.canvas.add(image);
    });
  };
  const handleRemoveObject = () => {
    if (selectedObject) editor?.canvas.remove(selectedObject);
  };
  const handleClearSelection = () => {
    editor?.canvas.discardActiveObject().renderAll();
  };
  const handleReset = () => {
    editor?.canvas.clear();
    editor?.canvas.selection;
  };

  const changeDesign = (design: Design) => {
    editor?.canvas.loadFromJSON(design.data, () => {});
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = (e.target as any)[0].value;
    const data = editor?.canvas.toJSON();

    setDesigns((state) => {
      const newState = [
        ...state,
        {
          title,
          data,
        },
      ];
      localStorage.setItem("designs", JSON.stringify(newState));
      return newState;
    });

    (e.target as HTMLFormElement).reset();
  };
  const handleDeleteAllDesigns = () => {
    localStorage.setItem("designs", JSON.stringify([]));

    setDesigns([]);
  };

  useEffect(() => {
    const savedDesigns = localStorage.getItem("designs");
    if (savedDesigns) {
      setDesigns(JSON.parse(savedDesigns));
    }

    //Disables multi selection
    editor?.canvas.on("selection:created", (e) => {
      if (e.target?.type == "activeSelection")
        editor.canvas.discardActiveObject();
    });
  }, []);

  return (
    <div className="App">
      <h1>FabricJS React Sample</h1>
      <button onClick={handleAddCircle}>Add circle</button>
      <button onClick={handleAddRectangle}>Add Rectangle</button>
      <button onClick={handleAddImage}>Add Image</button>
      <button onClick={handleReset}>Reset</button>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Design title here..." />
        <input type="submit" value="Save" />
      </form>
      {designs.length > 0 && (
        <div>
          <h2>Saved Designs</h2>
          <button
            onClick={handleDeleteAllDesigns}
            style={{ display: "block", margin: "auto" }}
          >
            Delete all designs
          </button>
          {designs.map((design, index) => (
            <div
              key={`${design.title} ${index}`}
              style={{
                cursor: "pointer",
                display: "inline-block",
                border: "1px solid black",
                margin: "4px",
                padding: "4px",
              }}
              onClick={() => changeDesign(design)}
            >
              <h3>{design.title}</h3>
            </div>
          ))}
        </div>
      )}
      <button disabled={!selectedObject} onClick={handleRemoveObject}>
        Remove Selected
      </button>

      <div className="canvas">
        <div className="canvas-background" onClick={handleClearSelection}></div>
        <FabricJSCanvas className="canvas-foreground" onReady={onReady} />
      </div>
    </div>
  );
}

//https://picsum.photos/seed/picsum/200
