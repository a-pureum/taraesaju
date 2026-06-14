/** Lib */
import dayjs, { Dayjs } from 'dayjs';

/** Custom */
import { cheongan } from '@/common/const/cheonganConst';
import { jiji } from '@/common/const/jijiConst';
import { woonsung } from '@/common/const/woonsungConst';
import { checkSipsinData } from './sipsinDataServerService';
import { check12Sinsal } from './sinsalDataServerService';

/** Type & Interface */
import { CheonganType, JijiType } from '@/common/type/basicType';
import { BirthColumnItem } from '@/common/type/baseInterface';
import { DivisionJsonData } from '@/common/type/jsonDataInterface';
import { DaeunData, SeunData, YearListData } from '@/common/type/luckyDataInterface';

/**
 * 대운 계산 - 태양력
 */
export const checkTargetDaeun = (
    gender: 'M' | 'F',
    targetDivision: DivisionJsonData[],
    solarBirth: Dayjs,
    yearColumn: BirthColumnItem<CheonganType, JijiType>,
    monthColumn: BirthColumnItem<CheonganType, JijiType>,
    dayColumn: BirthColumnItem<CheonganType, JijiType>,
): DaeunData[] => {
    const yearGanEumyang = cheongan[yearColumn.gan].eumyang;
    let flowStr: '순행' | '역행' = '순행';
    if (gender === 'M') {
        flowStr = yearGanEumyang === '양' ? '순행' : '역행';
    } else {
        flowStr = yearGanEumyang === '양' ? '역행' : '순행';
    }

    let divisionDate;
    for (let idx = 0; idx < targetDivision.length; idx++) {
        const item = targetDivision[idx];
        const targetDay = dayjs(item.locdate, 'YYYYMMDD');

        if (idx !== targetDivision.length - 1) {
            const after = targetDivision[idx + 1];
            const afterDay = dayjs(after.locdate, 'YYYYMMDD');

            if (solarBirth.isSameOrAfter(targetDay) && solarBirth.isBefore(afterDay)) {
                divisionDate = flowStr === '순행' ? afterDay : targetDay;
                break;
            }
        }
    }

    const daeunList = [];
    if (divisionDate) {
        const daysBetween =
            flowStr === '순행'
                ? divisionDate.diff(solarBirth, 'day')
                : solarBirth.diff(divisionDate, 'day');
        const daeunNum = Math.round(daysBetween / 3);
        const defaultMonthGan = monthColumn.gan;
        const defaultMonthJiji = monthColumn.jiji;

        for (let daeunIdx = 0; daeunIdx < 10; daeunIdx++) {
            const multipleNum = flowStr === '순행' ? 1 : -1;
            const targetGanNum =
                (10 + cheongan[defaultMonthGan].number + (daeunIdx + 1) * multipleNum) % 10;
            const targetJijiNum =
                (12 + jiji[defaultMonthJiji].number + (daeunIdx + 1) * multipleNum) % 12;
            const targetGanData = Object.entries(cheongan).find(
                ([key, value]) => value.number === targetGanNum,
            );
            const targetJijiData = Object.entries(jiji).find(
                ([key, value]) => value.number === targetJijiNum,
            );

            if (targetGanData && targetJijiData) {
                const targetGan: CheonganType = targetGanData[0] as CheonganType;
                const targetJiji: JijiType = targetJijiData[0] as JijiType;

                const daeunData = {
                    daeunNum: daeunNum + daeunIdx * 10,
                    flowStr,
                    gan: targetGan,
                    jiji: targetJiji,
                    ganSipsin: checkSipsinData(
                        dayColumn.gan,
                        targetGanData[1].element,
                        targetGanData[1].eumyang,
                    ),
                    jijiSipsin: checkSipsinData(
                        dayColumn.gan,
                        targetJijiData[1].element,
                        targetJijiData[1].isInvert
                            ? targetJijiData[1].eumyang === '양'
                                ? '음'
                                : '양'
                            : targetJijiData[1].eumyang,
                    ),
                    woonsung: woonsung[targetGan][targetJiji],
                    sinsal: check12Sinsal(yearColumn.jiji, targetJiji),
                };

                daeunList.push(daeunData);
            }
        }
    }

    return daeunList;
};

/**
 * 세운 계산 - 태양력
 */
export const checkTargetSeun = (
    solarBirth: Dayjs,
    daeunNum: number,
    yearColumn: BirthColumnItem<CheonganType, JijiType>,
    dayColumn: BirthColumnItem<CheonganType, JijiType>,
): SeunData[][] => {
    const standardYear = 1900;
    const standardGan = '경';
    const standardJiji = '자';

    const solYear = solarBirth.year();
    const distanceStandard = solYear - standardYear;
    const daeNum = daeunNum - 1;

    const seunList = [];
    for (let daeunIdx = 0; daeunIdx < 10; daeunIdx++) {
        const itemList = [];

        for (let seunIdx = 0; seunIdx < 10; seunIdx++) {
            const targetGanNum =
                (cheongan[standardGan].number +
                    distanceStandard +
                    daeNum +
                    seunIdx +
                    10 * daeunIdx) %
                10;
            const targetJijiNum =
                (jiji[standardJiji].number + distanceStandard + daeNum + seunIdx + 10 * daeunIdx) %
                12;
            const targetGanData = Object.entries(cheongan).find(
                ([key, value]) => value.number === targetGanNum,
            );
            const targetJijiData = Object.entries(jiji).find(
                ([key, value]) => value.number === targetJijiNum,
            );

            if (targetGanData && targetJijiData) {
                const targetGan: CheonganType = targetGanData[0] as CheonganType;
                const targetJiji: JijiType = targetJijiData[0] as JijiType;

                const seunData: SeunData = {
                    daeunNum: daeunNum + daeunIdx * 10,
                    yearNum: standardYear + distanceStandard + daeNum + seunIdx + 10 * daeunIdx,
                    gan: targetGan,
                    jiji: targetJiji,
                    ganSipsin: checkSipsinData(
                        dayColumn.gan,
                        targetGanData[1].element,
                        targetGanData[1].eumyang,
                    ),
                    jijiSipsin: checkSipsinData(
                        dayColumn.gan,
                        targetJijiData[1].element,
                        targetJijiData[1].isInvert
                            ? targetJijiData[1].eumyang === '양'
                                ? '음'
                                : '양'
                            : targetJijiData[1].eumyang,
                    ),
                    woonsung: woonsung[targetGan][targetJiji],
                    sinsal: check12Sinsal(yearColumn.jiji, targetJiji),
                };

                itemList.push(seunData);
            }
        }

        seunList.push(itemList);
    }

    return seunList;
};

export const checkYearOheang = (
    targetYear: number,
    birthYear: number,
    firstDaeun: DaeunData,
): YearListData[] => {
    const standardYear = 1900;
    const standardGan = '경';
    const standardJiji = '자';

    const resultList = [];

    const cheonganList = Object.keys(cheongan);
    const jijiList = Object.keys(jiji);

    for (let i = 0; i < 10; i++) {
        const year = targetYear + i;
        const flowNum = firstDaeun.flowStr === '순행' ? 1 : -1;
        const daeunIdx = Math.floor((year - birthYear + 1 - firstDaeun.daeunNum) / 10) * flowNum;

        const daeunGanNum = (10 + cheongan[firstDaeun.gan].number + daeunIdx) % 10;
        const daeunJijiNum = (12 + jiji[firstDaeun.jiji].number + daeunIdx) % 12;
        const seunGanNum = (cheongan[standardGan].number + year - standardYear) % 10;
        const seunJiNum = (jiji[standardJiji].number + year - standardYear) % 12;

        resultList.push({
            year,
            daeunIdx,
            daeunGan: cheonganList[daeunGanNum] as CheonganType,
            daeunJiji: jijiList[daeunJijiNum] as JijiType,
            seunGan: cheonganList[seunGanNum] as CheonganType,
            seunJiji: jijiList[seunJiNum] as JijiType,
        });
    }

    return resultList;
};
