/** lib */
import dayjs from 'dayjs';
import KoreanLunarCalendar from 'korean-lunar-calendar';

/** Type & Interface */
import { birthDataInterface } from '@/client/birthDataService';
import { DaeunData, SeunData } from '@/common/type/luckyDataInterface';
import { cheongan } from '../const/cheonganConst';
import { CheonganType, JijiType } from '../type/basicType';
import { jiji } from '../const/jijiConst';

export const calculateCalendar = (profileData: birthDataInterface) => {
    const calendar = new KoreanLunarCalendar();
    const splitBirthday = profileData.birthday.split('-').map((item) => Number(item));

    if (profileData.calendarType === 'solar') {
        calendar.setSolarDate(splitBirthday[0], splitBirthday[1], splitBirthday[2]);
    } else {
        calendar.setLunarDate(
            splitBirthday[0],
            splitBirthday[1],
            splitBirthday[2],
            profileData.calendarType === 'leap',
        );
    }
    return calendar;
};

export const calculateInitialIdx = (
    profileData: birthDataInterface,
    daeun: DaeunData[],
    seun: SeunData[][],
) => {
    let daeunIdx = 0;
    let seunIdx = 0;

    const _calender = calculateCalendar(profileData);
    if (_calender) {
        const solarDate = _calender.getSolarCalendar();
        const currentYear = dayjs().year();
        const diff = currentYear - solarDate.year + 1;

        for (let idx = 0; idx < daeun.length; idx++) {
            if (idx === daeun.length - 1 && daeun[idx].daeunNum <= diff) {
                daeunIdx = idx;
                break;
            } else if (daeun[idx].daeunNum <= diff && diff < daeun[idx + 1].daeunNum) {
                daeunIdx = idx;
                break;
            }
        }

        const targetSeun = daeunIdx ? seun[daeunIdx] : [];
        for (let idx = 0; idx < targetSeun.length; idx++) {
            if (targetSeun[idx].yearNum && currentYear === targetSeun[idx].yearNum) {
                seunIdx = idx;
                break;
            }
        }
    }

    return {
        daeunIdx: daeunIdx,
        seunIdx: seunIdx,
    };
};

export const calculateCurrentDaeun = (
    profileData: birthDataInterface,
    daeun: DaeunData[],
): Pick<DaeunData, 'gan' | 'jiji'> | null => {
    const _calender = calculateCalendar(profileData);
    if (_calender) {
        const solarDate = _calender.getSolarCalendar();
        const currentYear = dayjs().year();
        const diff = currentYear - solarDate.year + 1;

        const daeunNum = daeun[0].daeunNum;
        const currentDaeunIdx = Math.floor((diff - daeunNum) / 10);

        if (currentDaeunIdx <= 0) return null;

        if (currentDaeunIdx + 1 <= daeun.length) {
            return daeun[currentDaeunIdx];
        } else {
            const flowNum = daeun[0].flowStr === '순행' ? 1 : -1;
            const idxDiff = (currentDaeunIdx - daeun.length + 1) * flowNum;
            const cheonganList = Object.entries(cheongan);
            const jijiList = Object.entries(jiji);

            const currentGan =
                cheonganList[(cheongan[daeun[daeun.length - 1].gan].number + idxDiff + 10) % 10];
            const currentJiji =
                jijiList[(jiji[daeun[daeun.length - 1].jiji].number + idxDiff + 12) % 12];

            return {
                gan: currentGan[0] as CheonganType,
                jiji: currentJiji[0] as JijiType,
            };
        }
    }

    return null;
};
