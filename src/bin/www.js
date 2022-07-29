import App from '../app.js';
import 'dotenv/config';

import {
    AdminRoutes,
    AgreementRoutes,
    AuthRoutes,
    EventRoutes,
    MileageRoutes,
    NoticeRoutes,
    ProgramRoutes,
    QnaRoutes,
    GroupRoutes, PushRoutes,
} from '../api/index.js';

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
    ]);
    app.listen();
}

startServer().catch((err) => console.log(err));