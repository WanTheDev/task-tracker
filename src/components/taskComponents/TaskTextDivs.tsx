import classes from '../../styles/taskTextStyles.module.css'

interface divProps {
    type:'desc' | 'title'
    value?:string | undefined
    editState: () => void
    children: string | JSX.Element | JSX.Element[]
}

const TaskTextDiv = ({type, editState, children}:divProps) => 
  <div
    className={type=='desc' ? classes.description : classes.title}
    onClick={editState}
    data-decoration={type} // used for title strikethrough in taskStyles.module.css
    >
    {children}
  </div>

export default TaskTextDiv