const path = require('path');
const {
    confirmSystem: {
        isWindows
    },
    getAllFiles,
} = require('./tools/index');
const pubPath = process.cwd();
const validateEmpty = (value) => {
    return value.length > 0;
}
const commandList = ['yarn', 'cnpm', 'npm'];
const tempDirName = 'template';
const init = `${tempDirName}/init`;
const webProj = `${tempDirName}/webProj`;
module.exports = function (plop) {
    plop.setActionType('install', function (answers, config, plop) {
        // 返回执行命令的目录
        // process.cwd()
        function install(command = commandList[0]) {
            const child_process = require('child_process')
            const args = ['install']
            const cwd = path.join(process.cwd(), answers.name)
            const getRelCommand = (command) => {
                return `${command}${isWindows()? '.cmd':''}`
            }
            const task = child_process.spawn(getRelCommand(command), args, {
                cwd
            });
            task.on('close', () => {
                console.log('依赖安装完成');
                console.log(`执行: cd ${answers.name}，进入目录`);
                console.log(`进入目录后，执行 yarn startWebpack && yarn startElectron，启动项目`);
            });
            task.stdout.on('data', data => {
                console.log(`${data}`);
            });
            task.on('error', (data) => {
                console.log('' + data)
                console.log(`未找到command: ${command}`)
                const nextIndex = commandList.findIndex(item => item === command) + 1;
                if (!commandList[nextIndex]) {
                    // console.log(`依赖下载失败，执行: cd ${answers.name}，进入目录后手动安装依赖`);
                    throw `依赖下载失败，执行: cd ${answers.name}，进入目录后手动安装依赖`;
                }
                install(commandList[nextIndex]);
            });
        }
        install()
    });
    plop.setActionType('git_init', function (answers, config, plop) {
        function gitInit() {
            const child_process = require('child_process')
            const args = ['init']
            const cwd = path.join(process.cwd(), answers.name)
            const getRelCommand = (command) => {
                return `${command}${isWindows()? '.cmd':''}`
            }
            const task = child_process.spawn(getRelCommand('git'), args, {
                cwd
            });
            task.stdout.on('data', data => {
                console.log(`${data}`);
            });
            task.on('error', (data) => {
                throw `初始化git仓库失败，执行: cd ${answers.name}，进入目录后手动进行git init && yarn install`;
            });
        }
        gitInit()
    });
    const res = plop.setGenerator('component', {
        description: '新建项目',
        prompts: [{
                type: 'input',
                name: 'name',
                message: '请输入项目名称',
                validate: validateEmpty
            },
            {
                type: 'input',
                name: 'description',
                default: '',
                message: '请输入组件描述（可选）'
            },
            {
                type: 'input',
                name: 'version',
                default: '1.0.0',
                message: '请输入组件版本号'
            },
            {
                type: 'input',
                name: 'author',
                message: '请输入开发者姓名',
            },
            {
                type: 'input',
                name: 'projName',
                default: 'project',
                message: 'web项目英文名称'
            },
        ],
        actions: ({
            projName
        }) => {
            const initFilesPath = getAllFiles(path.join(__dirname, init));
            const webProjFilesPath = getAllFiles(path.join(__dirname, webProj));
            const actions = [];
            initFilesPath.forEach(item => {
                const fileName = item.split(init+'/').at(-1).split('.hbs')[0];
                actions.push({
                    type: 'add',
                    path: `${pubPath}/{{name}}/${fileName}`,
                    templateFile: item
                })
            })
            webProjFilesPath.forEach(item => {
                const fileName = item.split(webProj+'/').at(-1).split('.hbs')[0];
                actions.push({
                    type: 'add',
                    path: `${pubPath}/{{name}}/src/${projName}/${fileName}`,
                    templateFile: item
                })
            })
            
            actions.push({
                type: 'git_init',
            })

            actions.push({
                type: 'install',
            })

            return actions;
        }
    });

    // console.log(plop, res)
};