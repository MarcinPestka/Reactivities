import React from "react";
import { Grid, GridColumn, List } from "semantic-ui-react";
import { Activity } from "../../../Models/activity";
import ActivityDetails from "../Details/ActivityDetails";
import ActivityList from './ActivityList';
import ActivityForm from "../Form/ActivityForm";

interface Props{
    activities: Activity[];

    selectedActivity: Activity | undefined;
    selectActivity: (id:string) => void;
    cancelSelectActivity: () => void

    editMode: boolean;
    openForm: (id:string) => void;
    closeForm: () => void;

    createOrEdit: (activity:Activity) =>void;

    deleteActivity:  (id:string) => void;

    submitting: boolean;
}

export default function ActivityDashboard({activities,selectActivity,selectedActivity,cancelSelectActivity,
     editMode,openForm,closeForm, createOrEdit,deleteActivity, submitting}:Props) {
    return (
        <Grid>
            <GridColumn width='10'>
                <List>
                    <ActivityList activities={activities} selectActivity={selectActivity} 
                    deleteActivity={deleteActivity} submitting={submitting}/>
                </List>
            </GridColumn>
            <GridColumn width='6'>
                {selectedActivity && !editMode &&
                <ActivityDetails 
                activity={selectedActivity} 
                cancelSelectActivity={cancelSelectActivity} 
                openForm={openForm}
                cancelForm={closeForm}/>}
                {editMode &&
                <ActivityForm activity={selectedActivity} closeForm={closeForm} createOrEdit={createOrEdit} submitting={submitting}></ActivityForm>}
            </GridColumn>
        </Grid>
    )
}