import { title } from '../lib/format';

export default function NoteModal({ctx}){
  const {active,noteOpen,noteText,saveNote,setNoteOpen,setNoteText}=ctx;
  return (<>
  {noteOpen&&<div className="backdrop" onClick={e=>e.target===e.currentTarget&&setNoteOpen(false)}><section className="modal note-modal"><button className="close" onClick={()=>setNoteOpen(false)}>×</button><small className="overline">PERSONAL NOTES</small><h2>Add a <em>thought.</em></h2><p>{title(active)}</p><textarea rows="5" value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="What would you like to remember?"/><div className="actions end"><button className="outline" onClick={()=>setNoteOpen(false)}>Cancel</button><button className="primary" onClick={saveNote}>Save note</button></div></section></div>}
  </>);
}
