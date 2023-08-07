import React, { useContext, useState } from "react";
import noteContext from "../Context/notes/NoteContext";

const Addnote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "",
  });
  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({
      title: "",
      description: "",
      tag: "",
    })
    props.showAlert("Added Succesfully","success")
  };
  onchange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="container my-3">
        <h2>Add a Note</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              name="title"
              id="title"
              value={note.title}
              aria-describedby="emailHelp"
              onChange={onchange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              value={note.description}
              name="description"
              onChange={onchange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">
              Tag
            </label>
            <input type="text" onChange={onchange} value={note.tag} className="form-control" id="tag" name="tag" />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleClick}
            disabled={note.title.length<5 || note.description.length<5}

          >
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addnote;
