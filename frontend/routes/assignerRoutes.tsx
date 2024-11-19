import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import AssignerHomeScreen from "../screens/Assigner/AssignerHomeScreen";
import Profile from "../screens/Assigner/Profile";
import Notifications from "../screens/Assigner/Notifications";
import Tasks from "../screens/Assigner/AssignerTasks";
import AssigneeNavbar from "../components/AssigneeBottomHeader";
import CreateTaskModal from "../components/CreateTaskModal";
import AssigneeTaskModal from "../screens/Assigner/AssignerTasks";
import SingleTaskScreen from "../screens/Assigner/SingleTaskScreen";
import TaskStatusScreen from "../screens/Assigner/TaskStatusScreen";

const AssigneeStack = createStackNavigator();

const AssigneeRoutes = () => {
    return (
        <>
            <AssigneeStack.Navigator initialRouteName="AssigneeHome">
                <AssigneeStack.Screen name="AssigneeHome" component={AssignerHomeScreen} options={{ title: 'Assigner Home' }} />
                <AssigneeStack.Screen name="AssigneeTasks" component={AssigneeTaskModal} options={{ title: 'Assign Task' }} />
                <AssigneeStack.Screen name="AssigneeNotifications" component={Notifications} options={{ title: 'Notifications' }} />
                <AssigneeStack.Screen name="AssigneeProfile" component={Profile} options={{ title: 'Profile' }} />
                <AssigneeStack.Screen name="SingleTaskScreen" component = {SingleTaskScreen} />
                <AssigneeStack.Screen name="TaskStatusScreen" component = {TaskStatusScreen} />
            </AssigneeStack.Navigator>
            <AssigneeNavbar />
        </>
    );
};

export default AssigneeRoutes;
