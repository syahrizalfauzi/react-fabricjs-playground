import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";
import "./App.css";
import React, { useEffect, useState } from "react";
import Design from "./types/design";

export default function App() {
  const { editor, onReady } = useFabricJSEditor();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const onAddCircle = () => {
    editor?.addCircle();
  };
  const onAddRectangle = () => {
    editor?.addRectangle();
  };
  const onAddImage = () => {
    fabric.Image.fromURL("https://picsum.photos/seed/picsum/200", (image) => {
      editor?.canvas.add(image);
    });
  };
  const onReset = () => {
    editor?.canvas.loadFromJSON({ version: "4.3.1", objects: [] }, () => {});
  };

  const changeDesign = (design: Design) => {
    setIsLoading(true);
    editor?.canvas.loadFromJSON(design.data, () => {
      setIsLoading(false);
    });
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
    setIsLoading(false);
  }, []);

  return (
    <div className="App">
      <h1>FabricJS React Sample</h1>
      <button onClick={onAddCircle}>Add circle</button>
      <button onClick={onAddRectangle}>Add Rectangle</button>
      <button onClick={onAddImage}>Add Image</button>
      <button onClick={onReset}>Reset</button>
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

      <FabricJSCanvas className="sample-canvas" onReady={onReady} />
    </div>
  );
}

//https://picsum.photos/seed/picsum/200
