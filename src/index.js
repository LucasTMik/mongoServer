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

server.start({ port })
    .then(() => console.log(chalk.green(`Server listening at port ${ port }`)))
    .catch(err => console.log(err));

