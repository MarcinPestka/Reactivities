import React, { useEffect,useState } from 'react';
import './styles.css';
import axios from 'axios';
import {Container} from 'semantic-ui-react';
import { Activity } from '../Models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../Features/Activities/Dashboard/ActivityDashboard';
import {v4 as uuid} from "uuid";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined >(undefined);
  const [editMode, setEditMode] = useState(false);

  
  useEffect(()=>{
    axios.get<Activity[]>("http://localhost:5000/api/activities")
    .then(response=>{
      setActivities(response.data)
    })
  },[])

  function handleSelectActivity(id:string){
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handlerCancelSelectActivity(){
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?:string) {
    id ? handleSelectActivity(id) : handlerCancelSelectActivity();
    setEditMode(true);
  }

  function handlerFormClose(){
    setEditMode(false);
  }

  function handleCreateorEditActivity(activity:Activity) {
    activity.id ? setActivities([...activities.filter(x=>x.id !== activity.id), activity]) 
    : setActivities([...activities,{...activity,id: uuid()}]);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string){
    setActivities([...activities.filter(x=>x.id !== id)])
  }

  return (
    <div>
        <NavBar openForm={handleFormOpen}/>
        <Container style={{marginTop:'7em'}}>
          <ActivityDashboard 
          activities={activities}

          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handlerCancelSelectActivity}

          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handlerFormClose}

          createOrEdit={handleCreateorEditActivity}

          deleteActivity={handleDeleteActivity}
          />
        </Container>
    </div>
  );
}

export default App;
