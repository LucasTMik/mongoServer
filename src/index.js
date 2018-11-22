import server from './server';
import chalk from 'chalk';

console.log(chalk.blue(' == Server Loading =='));

process.on('uncaughtException',  err => {
    console.error('Unhandled Exception', err);
})

process.on('uncaughtRejection', err => {
    console.error('Ungandled Rejection', err);
})

const port = process.env.PORT || 4100;

const service = async () => {
    const serverStart = await server.start({ port });
    console.log( chalk.green(` Server started succesfully, running at port ${port}`));
    return serverStart;
}

service();
export default service;