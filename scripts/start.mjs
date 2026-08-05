import { spawn } from "node:child_process";

const commands = [
  ["api", "npm", ["run", "start", "--workspace=@todo/api"]],
  ["web", "npm", ["run", "start", "--workspace=@todo/web"]],
];

const children = commands.map(([name, command, args]) => {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4100/api" },
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
      process.exitCode = code;
    }
  });

  return child;
});

const stop = () => {
  for (const child of children) {
    child.kill();
  }
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);


