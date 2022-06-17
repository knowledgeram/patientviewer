import './App.css';
import ListComponent from 'react-list-select'
import React , { useState, useEffect } from 'react'

let caseSelected;

const styles = {
  header: {
    width: '100%'
  },
  item: {
    marginRight: 20
  },
  wrapper: {
    borderTop: 'black solid 1px',
    display: 'flex',
    flexWrap: 'wrap'
  }
}


const cases = [
  {id: 1, name: "The patient is a 32 year old female who presents to the Urgent Care complaining of sore throat that started 7 days ago. Developed into post nasal drip and then cough. No measured fevers. Had chills and body aches at the onset that resolved after the first day. A little facial headache with the congestion at times; better today. Some pressure on and off in the ears, no pain, hearing loss or tinnitus. Cough is mostly dry, sometimes productive of clear sputum. Denies shortness of breath. Never smoker. Has never needed inhalers. No history of pneumonia. Currently treating with ibuprofen which helps. Tried some over-the-counter Mucinex ES and vitamin C." },
  {id: 2, name: "The patient is a 32 year old female who presents to the Urgent Care complaining of sore throat that started 7 days ago. Developed into post nasal drip and then cough. No measured fevers. Had chills and body aches at the onset that resolved after the first day. A little facial headache with the congestion at times; better today. Some pressure on and off in the ears, no pain, hearing loss or tinnitus. Cough is mostly dry, sometimes productive of clear sputum. Denies shortness of breath. Never smoker. Has never needed inhalers. No history of pneumonia. Currently treating with ibuprofen which helps. Tried some over-the-counter Mucinex ES and vitamin C." }
];



const answers = new Map();

const useKeyPress = function(targetKey) {
  const [keyPressed, setKeyPressed] = React.useState(false);

  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};



  const ListItem = ({ item, setSelected,setHovered, setActive }) => {
    const [activeItem, setActiveItem] = useState(false);
    return(
    <div
      className={`${activeItem ? "bg-success" : ""}`}
      onClick={() => {setSelected(item);setActiveItem(true)}}
      onMouseEnter={() => setHovered(item)}
      onMouseLeave={() => setHovered(undefined)}
    >
      {item.name}
    </div>
    );
  };

const ListCases = ({parentCallback}) => {
  const [selected, setSelected] = useState(undefined);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");
  const [cursor, setCursor] = useState(0);
  const [hovered, setHovered] = useState(undefined);

  useEffect(() => {
    if (cases.length && downPress) {
      setCursor(prevState =>
        prevState < cases.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [downPress]);
  useEffect(() => {
    if (cases.length && upPress) {
      setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress]);
  useEffect(() => {
    if (cases.length && enterPress) {
      setSelected(cases[cursor]);
    }
  }, [cursor, enterPress]);
  useEffect(() => {
    if (cases.length && hovered) {
      setCursor(cases.indexOf(hovered));
    }
  }, [hovered]);

  useEffect(() => {
    if (cases.length && selected) {
      setCursor(cases.indexOf(hovered));
      console.log("parent callback called");
      parentCallback(cases[cursor], cases.length);
      console.log("cases length"+cases.length)
    }
  }, [selected]);

  return (
    <div>
      <br/>

      <label>Case Selected: {selected ? selected.id : "none"}</label>
      <br/>
      <ul class="list-group">
      {cases.map((item, i) => (
      <li class="list-group-item" key={i}>Case : {i+1}
      <ListItem
          key={item.id}
          item={item}
          setSelected={setSelected}
          setHovered={setHovered}
        />
        </li>
      ))}
      </ul>
    </div>
  );
};

function App() {
  const [selectedValueList, setSelectedValueList] = React.useState();
  const [answerlength, setAnswerlength] = React.useState(0);
  const [answeredAll, setAnsweredAll] = React.useState(false);

  const handleCallback1 = React.useCallback((childData, length) => {
    setSelectedValueList(childData.id);
    setAnswerlength(length);
    console.log("called");
    console.log(childData);
    console.log("Answer length "+answerlength);
    console.log("Answer size "+ answers.size);
  },[]);

  const icdconditioncodes = [
    "A09	Infectious gastroenteritis and colitis unspecified",
    "A64	Unspecified sexually transmitted disease",
    "B300	Keratoconjunctivitis due to adenovirus"
    ];

  

  return (
    <div className="App">
      <p>Here are cases. Select one and then select condition code below. Once both are selected case is updated. Finally after all selection of cases and conditions you are done. </p>
      <ListCases parentCallback={handleCallback1}/>
      <br/>

      <p>Select condition code after selecting cases </p>

      <ListComponent
        items={icdconditioncodes}
        onChange={(selectedItems) => { console.log(selectedItems); answers.set(selectedValueList, icdconditioncodes[selectedItems]); console.log(answers);
          if((parseInt(answers.size) > 0) && (parseInt(answers.size) === parseInt(answerlength)))
          {
            setAnsweredAll(true);
            console.log("all answered");
          }
          console.log("Answer length "+answerlength + " Answer size "+ answers.size); } }
      />
      <br/>
      <label> {(answeredAll) ? "You are done " + JSON.stringify(Object.fromEntries(answers)): "More cases to be answered"}</label>
    </div>
  );
}

export default App;
