import Phaser from "phaser";

export default class SekaiGameLearnMean extends Phaser.GameObjects.Container {
    constructor(scene, x,y, correct_mean, wrong_mean) {
        super(scene, x, y);
        this.correct_mean = correct_mean;
        this.wrong_mean = wrong_mean;

        const ruby_border = "|";
        this.ruby_border = ruby_border;
        //meanのフォントサイズは24px、そしてルビはその1/4サイズ

        const ruby_font_size = '6px';
        const mean_font_size = '24px';
    }

    correctMean = () => {
        const correct_mean_splited_with_ruby = this.correct_mean.split(this.ruby_border);
        let correct_mean_spliteds = [];
        let correct_mean_rubys = [];
        let correct_mean_ruby_targets = [];//ルビをふる漢字をルビの順番に収容。対応するルビは配列のインデックスが同じものをえらべばおｋ
        for(let i = 0; i < correct_mean_splited_with_ruby.length; i++) {
            if(i % 2 === 0) {
                correct_mean_spliteds.push(correct_mean_splited_with_ruby[i]);
            } else {
                correct_mean_rubys.push(correct_mean_splited_with_ruby[i]);
            }
        }
        for(let i = 0; i < correct_mean_spliteds.length; i++) {
            let corrects_last = correct_mean_spliteds[i].slice(-1);
            correct_mean_spliteds[i] = correct_mean_spliteds[i].slice(0, correct_mean_spliteds[i].length, -1);
            correct_mean_ruby_targets.push(corrects_last);
        }
    }

    wrongMean = () => {
        const wrong_mean_splited_with_ruby = this.wrong_mean.split(this.ruby_border);
        let wrong_mean_spliteds = [];
        let wrong_mean_rubys = [];
        let wrong_mean_ruby_targets = [];
        for(let i = 0; i < wrong_mean_splited_with_ruby.length; i++) {
            if(i % 2 === 0) {
                wrong_mean_spliteds.push(wrong_mean_splited_with_ruby[i]);
            } else {
                wrong_mean_rubys.push(wrong_mean_splited_with_ruby[i]);
            }
        }
        for(let i = 0; i < wrong_mean_spliteds.length; i++) {
            let wrongs_last = wrong_mean_spliteds[i].slice(-1);
            wrong_mean_spliteds[i] = wrong_mean_spliteds[i].slice(0, wrong_mean_spliteds[i].length, -1);
            wrong_mean_ruby_targets.push(wrongs_last);
        }
        
    }
}