import { forwardRef } from 'react';
import classes from '../../styles/taskTextStyles.module.css'
import useState from 'react-usestateref';

const ScallableInput = forwardRef(function ScallableInput({ type, value, onChange, resetEditState }:{type:'desc' | 'title',value: string, onChange: (event:any) => void, resetEditState: () => void}, ref:any) {
  const [shiftDown, setShiftState]=useState(false)

  const unfocusOnSubmit = (e:any) => {
    switch(e.key) {
      case 'Shift':
        setShiftState(true)
        break;
      case 'Enter':
        if (shiftDown==true) { break; }
        e.target.blur()
        resetEditState()
        break;
    }
  }

  const shiftStateCheck = (e:any) => {
    if (e.key=='Shift') { setShiftState(false) }
  }

  const placeCursorAtEnd = (e:any) => {
    var val = e.target.value;
    e.target.value = '';
    e.target.value = val;
  }
  
  return (
        <textarea
            ref={ref}
            onChange={onChange}
            onFocus={placeCursorAtEnd}
            onKeyDown={unfocusOnSubmit}
            onKeyUp={shiftStateCheck}
            value={value}
            rows={value.split("\n").length}
            autoFocus
            spellCheck={false}
            className={classes.textArea}
            data-title={type=='title' ? true : null}
            desc-desc={type=='desc' ? true : null}
        />
  );
});

export default ScallableInput;