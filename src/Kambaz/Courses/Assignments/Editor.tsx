
export default function AssignmentEditor() {
    return (
        <div id="wd-assignments-editor">
            <label htmlFor="wd-name"><h3>Assignment Name</h3></label>
            <input id="wd-name" value="A1 - ENV + HTML" /><br /><br />
            <textarea rows={10} cols={50} id="wd-description">
                The assignment is available online Submit a link to the landing page of
            </textarea>
            <br/>
            <br/>
            <table>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-points">Points</label>
                    </td>
                    <td>
                        <input id="wd-points" value={100} />
                    </td>
                </tr>

                <br/>

                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-group">Assignment Group</label>
                    </td>
                    <td>
                        <select id="wd-group">
                            <option selected value="ASSIGNMENTS">ASSIGNMENTS</option>
                            <option value="QUIZZES">QUIZZES</option>
                            <option value="EXAMS">EXAMS</option>
                            <option value="PROJECT">PROJECT</option>
                        </select>
                    </td>
                </tr>

                <br/>

                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-display-grade-as">Display Grade as</label>
                    </td>
                    <td>
                        <select id="wd-display-grade-as">
                            <option selected value="Percentage">Percentage</option>
                            <option value="Points">Points</option>
                            <option value="Letter Grade">Letter Grade</option>
                        </select>
                    </td>
                </tr>

                <br/>

                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-submission-type">Submission Type</label>
                    </td>
                    <td>
                        <select id="wd-submission-type">
                            <option selected value="Online">Online</option>
                            <option value="Paper">Paper</option>
                        </select>

                        <br/>
                        <br/>

                        Online Entry Options<br/>
                        
                        <input type="checkbox" name="check-type" id="wd-text-entry" />
                        <label htmlFor="wd-text-entry">Text Entry</label><br/>

                        <input type="checkbox" name="check-type" id="wd-website-url" />
                        <label htmlFor="wd-website-url">Website URL</label><br/>

                        <input type="checkbox" name="check-type" id="wd-media-recordings" />
                        <label htmlFor="wd-media-recordings">Media Recordings</label><br/>

                        <input type="checkbox" name="check-type" id="wd-student-annotation" />
                        <label htmlFor="wd-student-annotation">Student Annotation</label><br/>

                        <input type="checkbox" name="check-type" id="wd-file-upload" />
                        <label htmlFor="wd-file-upload">File Uploads</label><br/>
                        <br/>
                    </td>
                </tr>

                <br/>

                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-assign-to">Assign</label>
                    </td>
                    <td>
                        <label htmlFor="wd-assign-to">Assign to</label>
                        <br/>
                        <input id="wd-assign-to" value="Everyone" />
                        <br/>
                        <br/>

                        <label htmlFor="wd-due-date">Due</label><br/>
                        <input type="date" value="2024-05-13" id="wd-due-date"/><br/>
                        <br/>

                        <label htmlFor="wd-available-from">Available from</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <label htmlFor="wd-available-until" >Until</label><br/>
                        <input type="date" value="2024-05-13" id="wd-available-from"/>
                        <input type="date" value="2024-05-13" id="wd-available-until"/>
                    </td>
                </tr>

                <tr>
                    <td colSpan={2}>
                        <hr />
                    </td>
                </tr>

                <tr>
                    <td colSpan={2} align="right">
                        <button type="button">Cancel</button>&nbsp; 
                        <button type="submit">Save</button>
                    </td>
                </tr>

        </table>
    </div>
    );
}