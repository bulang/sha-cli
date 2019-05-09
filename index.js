#!/usr/bin/env node

const program = require('commander');
const download = require('download-git-repo');
const inquirer = require("inquirer");
const handlebars = require("handlebars");
const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const templates = {
    "sha":{
        "url":"https://github.com/bulang/sha",
        "downloadUrl":"http://github.com:bulang/sha#master",
        "description":"sha 框架模板"
    }
}
program
  .version('1.0.3');

program
  .command('init <template> <project>')
  .description('init your project')
  .action((templateName, projectName)=>{
      const spinner = ora().start('正在下载模板');
      const { downloadUrl } = templates[templateName];
      download(downloadUrl,projectName,{clone:true},(err)=>{
        if(err){
            spinner.fail();
            console.log(logSymbols.error, chalk.red('模板下载失败'))
           return false;
        }
        spinner.succeed("模板下载成功");
        inquirer.prompt([
            {
                type:'input',
                name:'name',
                message:"请输入项目名字"
            },
            {
                type:'input',
                name:'version',
                message:"请输入版本号"
            },
            {
                type:'input',
                name:'description',
                message:"请输入项目描述"
            },
            {
                type:'input',
                name:'author',
                message:"请输入项目作者"
            }
        ]).then((answers)=>{
            const projectPath = `${projectName}/package.json`;
            const packageContent = fs.readFileSync(projectPath,'utf-8');
            const packageResult = handlebars.compile(packageContent)(answers);
            fs.writeFileSync(projectPath,packageResult);
            console.log(logSymbols.success, chalk.blue('初始化模板成功'));
        });
      });
  });
program
  .command('list')
  .description('show all templates')
  .action(()=>{
        for(let key in templates){
            console.log(`${key}:${templates[key]['url']}`);
        }
  });
program.parse(process.argv);