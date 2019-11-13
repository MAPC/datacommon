import React, { useState } from 'react';

function Admin () {
  const [title, setTitle] = useState("");
  const [month, setMonth] = useState("");
  const [file, setFile] = useState("");
  const [description, setDescription] = useState("");
  
    return (
        <section className="route Admin">
        <section className="container admin__frame">
            <h2>Upload</h2>
            <form className="admin__form">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" onChange={e => setTitle(e.target.value)}></input>
                <label htmlFor="month">Month</label>
                <select name="month" onChange={e => setMonth(e.target.value)}>
                    <option value="" disabled defaultValue>---</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                </select>
                <label htmlFor="file">File</label>
                <input type="file" name="file"></input>
                <label htmlFor="description">Description</label>
                <textarea rows="4" cols="40" name="description"></textarea>
                <input type="submit" value="Submit" className="submit"></input>
            </form>
        </section>
        </section>
    );

}

export default Admin;