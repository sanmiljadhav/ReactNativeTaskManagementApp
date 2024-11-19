// import React from "react";
// import { createStackNavigator } from '@react-navigation/stack';
// import WorkerHomeScreen from "../screens/worker/WorkerHomeScreen";
// import Profile from "../screens/worker/Profile";
// import Notifications from "../screens/worker/Notifications";
// import Tasks from "../screens/worker/Tasks";

// import WorkerNavbar from "../components/WorkerBottomHeader";
// import WorkerTasks from "../screens/worker/Tasks";

// const WorkerStack = createStackNavigator();


// const WorkerRoutes = () => {
//     return (  // Add return statement here
//         <>
//             <WorkerStack.Navigator initialRouteName="WorkerHome">
//                 <WorkerStack.Screen name="WorkerHome" component={WorkerHomeScreen} options={{ title: 'Worker Home' }} />
//                 <WorkerStack.Screen name="WorkerTasks" component={WorkerTasks} options={{ title: 'Tasks' }} />
//                 <WorkerStack.Screen name="WorkerNotifications" component={Notifications} options={{ title: 'Notifications' }} />
//                 <WorkerStack.Screen name="WorkerProfile" component={Profile} options={{ title: 'Profile' }} />
//             </WorkerStack.Navigator>
//             <WorkerNavbar />
//         </>
//     );
// };

// export default WorkerRoutes


import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import WorkerNavbar from '../components/WorkerBottomHeader';
import WorkerHomeScreen from '../screens/worker/WorkerHomeScreen';
import Profile from '../screens/worker/Profile';
import Notifications from '../screens/worker/Notifications';
import WorkerTasks from '../screens/worker/Tasks';
import WorkerAssignedTask from '../screens/worker/Tasks';


const WorkerStack = createStackNavigator();

const WorkerRoutes = () => {
  return (
    <>
      <WorkerStack.Navigator initialRouteName="WorkerHome">
        <WorkerStack.Screen
          name="WorkerHome"
          component={WorkerHomeScreen}
          options={{ title: 'Worker Home' }}
        />
        <WorkerStack.Screen
          name="WorkerTasks"
          component={WorkerAssignedTask}
          options={{ title: 'Tasks' }}
        />
        <WorkerStack.Screen
          name="WorkerNotifications"
          component={Notifications}
          options={{ title: 'Notifications' }}
        />
        <WorkerStack.Screen
          name="WorkerProfile"
          component={Profile}
          options={{ title: 'Profile' }}
        />
      </WorkerStack.Navigator>
      <WorkerNavbar />
    </>
  );
};

export default WorkerRoutes;
