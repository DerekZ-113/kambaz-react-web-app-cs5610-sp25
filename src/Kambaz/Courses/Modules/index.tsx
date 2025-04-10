import { ListGroup, FormControl } from "react-bootstrap";
import { useParams } from "react-router";
import LessonControlButtons from "./LessonControlButtons";
import "../../style.css";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModuleControls";
import ModuleControlButtons from "./ModuleControlButtons";
import { useState, useEffect } from "react";
import { setModules, addModule, editModule, updateModule, deleteModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import ProtectedContent from "../../Account/ProtectedContent";
import * as coursesClient from "../client";
import * as modulesClient from "./client";

export default function Modules() {
    const { cid } = useParams();
    const [moduleName, setModuleName] = useState("");
    const modules = useSelector((state: any) => state.modulesReducer.modules);
    const dispatch = useDispatch();

    const fetchModules = async () => {
        const modules = await coursesClient.findModulesForCourse(cid as string);
        dispatch(setModules(modules));
    };

    const deleteModuleHandler = async (moduleId: string) => {
        await modulesClient.deleteModule(moduleId);
        dispatch(deleteModule(moduleId));
    };

    const updateModuleHandler = async (module: any) => {
        await modulesClient.updateModule(module);
        dispatch(updateModule(module));
    };

    useEffect(() => {
        fetchModules();
    }, [cid]);

    const addModuleHandler = async () => {
        const newModule = await coursesClient.createModuleForCourse(cid!, {
            name: moduleName,
            course: cid,
        });
        dispatch(addModule(newModule));
        setModuleName("");
    };

    return (
        <div className="wd-modules">
            <ProtectedContent>
                <ModulesControls 
                    moduleName={moduleName} 
                    setModuleName={setModuleName}
                    addModule={addModuleHandler} 
                />
            </ProtectedContent>
            <br/><br/><br/><br/>
            <ListGroup className="rounded-0" id="wd-modules">
                {modules.map((module: any) => (
                    <ListGroup.Item 
                        key={module._id}
                        className="wd-module p-0 mb-5 fs-5 border-gray"
                    >
                        <div className="wd-title p-3 ps-2 bg-secondary">
                            <BsGripVertical className="me-2 fs-3" />
                            {!module.editing && module.name}
                            {module.editing && (
                                <ProtectedContent>
                                    <input
                                        className="w-50 d-inline-block form-control"
                                        onChange={(e) => 
                                            updateModuleHandler({ ...module, name: e.target.value })
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                updateModuleHandler({ ...module, editing: false });
                                            }
                                        }}
                                        value={module.name}
                                    />
                                </ProtectedContent>
                            )}
                            <ProtectedContent>
                                <ModuleControlButtons 
                                    moduleId={module._id}
                                    deleteModule={(moduleId) => deleteModuleHandler(moduleId)}
                                    editModule={(moduleId) => dispatch(editModule(moduleId))}
                                />
                            </ProtectedContent>
                        </div>
                        {module.lessons && (
                            <ListGroup className="wd-lessons rounded-0">
                                {module.lessons.map((lesson: any) => (
                                    <ListGroup.Item 
                                        key={lesson._id}
                                        className="wd-lesson p-3 ps-1"
                                    >
                                        <BsGripVertical className="me-2 fs-3" />
                                        {lesson.name}
                                        <LessonControlButtons />
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}
