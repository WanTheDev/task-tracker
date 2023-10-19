import { useRef } from 'react'
import classes from '../../styles/taskTextStyles.module.css'

export default function EditableTag({tag, editing, editTag, tagOnChange, applyChanges}:{tag:string, editing:boolean, editTag:() => void, tagOnChange: (newTag:string) => void, applyChanges: (tagName:string, tagColor:string) => void}, ref:any) {
    return(
    <div className={classes.taskTag} onClick={() => {editTag()}}>
        <span contentEditable={true} onInput={(e) => {tagOnChange(e.currentTarget.innerHTML)}} className={classes.taskTagInput}>
            {tag.toString()}
        </span>
    </div>
    )
}