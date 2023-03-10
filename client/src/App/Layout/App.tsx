import React, { useEffect,useState } from 'react';
import './styles.css';
import {Container} from 'semantic-ui-react';
import { Activity } from '../Models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../Features/Activities/Dashboard/ActivityDashboard';
import {v4 as uuid} from "uuid";
import agent from '../api/agent';
import LoadingComponent from './loadingComponent';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined >(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(()=>{
    agent.Activities.list().then(response=>{
      let activities: Activity[] = [];
      response.forEach(activity =>{
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
      })
      setActivities(activities)
      setLoading(false);
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
    setSubmitting(true);
    if (activity.id){
      agent.Activities.update(activity).then(()=>{
        setActivities([...activities.filter(x=>x.id !== activity.id), activity])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(()=>{
        setActivities([...activities,activity])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }
  }

  function handleDeleteActivity(id: string){
    setSubmitting(true);
    agent.Activities.delete(id).then(()=>{
      setActivities([...activities.filter(x=>x.id !== id)])
      setSubmitting(false);
    });
  }

  if (loading) return <LoadingComponent content='Loading App'></LoadingComponent>

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

          submitting={submitting}
          />
        </Container>
    </div>
  );
}

export default App;
