import React, { useState, useEffect } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { useParams } from "react-router-dom";

const initialColor = {
  color: "",
  code: { hex: "" },
  id: Date.now()
};

const ColorList = ({ colors, updateColors, ...props }) => {
  const { id } = useParams;
  console.log("props colors", colors);
  const [editing, setEditing] = useState(false);
  const [newColor, setNewColor] = useState(initialColor);
  const [colorToEdit, setColorToEdit] = useState(initialColor);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };
  console.log("color to edit", colorToEdit);

  useEffect(() => {
    const colorToUpdate = colors.find(col => `${col.id}` === colorToEdit.id);
    if (colorToUpdate) {
      setColorToEdit(colorToUpdate);
    }
  }, []);

  const saveEdit = e => {
    e.preventDefault();

    axiosWithAuth()
      .put(`/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(res => {
        console.log("to edit", res);
        // setColorToEdit(res.data);

        // updateColors([...colors]);
        setEditing(false);
      });
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
  };
  console.log("colors after edit", colors);
  const deleteColor = color => {
    axiosWithAuth().delete(`/api/colors/${color.id}`);
    // props.history.push("/protected");

    // make a delete request to delete this color
  };
  const addNewColor = e => {
    e.preventDefault();
    axiosWithAuth()
      .post("/api/colors", newColor)
      .then(res => {
        console.log(res.data);
        updateColors(res.data, newColor);
      });
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span
                className="delete"
                onClick={e => {
                  e.stopPropagation();
                  deleteColor(color);
                }}
              >
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer">
        <form onSubmit={addNewColor}>
          <legend>Add a new color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setNewColor({ ...newColor, color: e.target.value })
              }
              value={newColor.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setNewColor({
                  ...newColor,
                  code: { hex: e.target.value }
                })
              }
              value={newColor.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button>cancel</button>
          </div>
        </form>
      </div>

      {/* stretch - build another form here to add a color */}
    </div>
  );
};

export default ColorList;
