import chalk from 'chalk';
import detectPort from 'detect-port';

const port = process.env.PORT || '4343';

detectPort(port, (_err, availablePort) => {
  if (port !== String(availablePort)) {
    throw new Error(
      chalk.whiteBright.bgRed.bold(
        `Port "${port}" on "localhost" is already in use. Please use another port. ex: PORT=1212 npm start`,
      ),
    );
  } else {
    process.exit(0);
  }
});
