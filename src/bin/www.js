import App from '../app.js';
import 'dotenv/config';
import os from 'os';
import cluster from 'cluster';
const systemCpuCores = os.cpus().length;

import {
    AdminRoutes,
    AgreementRoutes,
    AuthRoutes,
    EventRoutes,
    MileageRoutes,
    NoticeRoutes,
    ProgramRoutes,
    QnaRoutes,
    GroupRoutes, PushRoutes, SurveyRoutes
} from '../api/index.js';

if(cluster.isMaster){ // 코어수에 맞게 fork 실행
    for (let i = 0; i < systemCpuCores; i++) {
        cluster.fork();
    }
} else {
    async function startServer() {
        // await createConnection(connection).catch(err=>{ console.log("Catched err", err);})
        const app = new App([
            new AdminRoutes(),
            new AgreementRoutes(),
            new AuthRoutes(),
            new EventRoutes(),
            new MileageRoutes(),
            new NoticeRoutes(),
            new ProgramRoutes(),
            new QnaRoutes(),
            new GroupRoutes(),
            new PushRoutes(),
            new SurveyRoutes(),
        ]);
        app.listen();
    }
    startServer().catch((err) => console.log(err));
}

// async function startServer() {
//     // await createConnection(connection).catch(err=>{ console.log("Catched err", err);})
//     const app = new App([
//         new AdminRoutes(),
//         new AgreementRoutes(),
//         new AuthRoutes(),
//         new EventRoutes(),
//         new MileageRoutes(),
//         new NoticeRoutes(),
//         new ProgramRoutes(),
//         new QnaRoutes(),
//         new GroupRoutes(),
//         new PushRoutes(),
//         new SurveyRoutes(),
//     ]);
//     app.listen();
// }
// startServer().catch((err) => console.log(err));
