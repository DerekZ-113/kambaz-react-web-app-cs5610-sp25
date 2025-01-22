import Lab1 from "./Lab1";
import Lab2 from "./Lab2";
import {Route, Routes, Navigate} from "react-router";
import TOC from "./TOC";
import Lab3 from "./Lab3";

export default function labs() {
    return (
        <div>
            <h1>Labs</h1>
            <h3>Name: Derek Zhang</h3>
            <h3>Class: CS5610 Session 1</h3>
            <TOC />
            <Routes>
                <Route path="/" element={<Navigate to="Lab1" />} />
                <Route path="Lab1" element={<Lab1 />} />
                <Route path="Lab2/*" element={<Lab2 />} />
                <Route path="Lab3" element={<Lab3 />} />
            </Routes>
        </div>
    );
}