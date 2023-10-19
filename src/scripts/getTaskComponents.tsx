import React from "react";
import { TaskType } from "../Tasklist";
import TaskTextDiv from "../components/taskComponents/TaskTextDivs";

export const getTaskComponents = (componentType:'desc' | 'title', data:TaskType, editState: () => void) => {
  let divProps = {
    editState,
    type: componentType,
    key: componentType + data.id,
    value: data[componentType]
  }

  let valueLinebreaks=divProps.value.split("\n")
  if (divProps.value.trim().length===0 || valueLinebreaks.length<=1) {
    return(<TaskTextDiv {...divProps}>{divProps.value}</TaskTextDiv>)
  }
  
  return(<TaskTextDiv {...divProps}>{valueLinebreaks.map((c, i) => <React.Fragment key={i}>{c}<br /></React.Fragment>)}</TaskTextDiv>)
}