/** Lib */
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import objectSupport from 'dayjs/plugin/objectSupport';

import KoreanLunarCalendar from 'korean-lunar-calendar';

/** Custom */
import { cheongan } from '@/common/const/cheonganConst';
import { jiji } from '@/common/const/jijiConst';
import { division24 } from '@/common/const/division24Const';
import { woonsung } from '@/common/const/woonsungConst';
import { columnRelation } from '@/server/service/relationDataServerService';
import { check12Sinsal, checkSinsalData } from '@/server/service/sinsalDataServerService';
import { columnSipsinData } from '@/server/service/sipsinDataServerService';
import { createInfoData, checkDuplication } from '@/server/service/pointDataServerService';
import {
    checkOhaengStrength,
    checkOhaengTemp,
    checkNeedOhaeng,
} from '@/server/service/ohaengDataServerService';
import {
    checkTargetDaeun,
    checkTargetSeun,
    checkYearOheang,
} from '@/server/service/luckyDataServerService';

/** Data */
import division24Json from '@/server/data/division24.json';

/** Type & Interface */
import { CheonganType, JijiType, DivisionType } from '@/common/type/basicType';
import { RegionJsonData, DivisionJsonData } from '@/common/type/jsonDataInterface';
import { BirthColumnGroup, BirthColumnItem } from '@/common/type/baseInterface';
import {
    CorrectBirthDay,
    CorrectTargetDivision,
    BirthAllData,
    BirthColumnData,
} from '@/common/type/birthDataInterface';
import { birthDataInterface } from '@/client/birthDataService';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(objectSupport);

export const createAllBirthData = (birthDate: birthDataInterface): BirthAllData | null => {
    let correctBirth: CorrectBirthDay;

    // 시간 있는 경우 시간 보정
    if (birthDate.birthtime && birthDate.birthtime !== '') {
        const birthDateTime = birthDate.birthday + 'T' + birthDate.birthtime;
        correctBirth = correctBirthDay(birthDateTime, birthDate.location, birthDate.isDivideTime);
    } else {
        correctBirth = {
            date: birthDate.birthday,
            time: null,
            deltaMinutes: 0,
            summertimeMinutes: 0,
            isCalculateDate: false,
        };
    }

    // 양력 보정
    const solarBirthDate = createSolarBirthData(correctBirth.date, birthDate.calendarType);
    const solarBirth = dayjs(
        `${solarBirthDate.year}-${solarBirthDate.month}-${solarBirthDate.day}`,
        'YYYY-MM-DD',
    );

    const yearDivision = calculateYearDivision(solarBirth);
    const targetYear = yearDivision?.targetYear;
    const targetDivision = yearDivision?.targetDivision;

    const chartCol: BirthColumnGroup<BirthColumnData> = createBirthChartColData(
        correctBirth,
        solarBirth,
        targetYear,
        targetDivision,
    );

    if (chartCol) {
        const ohaengStrength = checkOhaengStrength(chartCol, true);
        const ohaengTemp = checkOhaengTemp(chartCol);
        const daeun = checkTargetDaeun(
            birthDate.gender,
            targetDivision,
            solarBirth,
            chartCol.year,
            chartCol.month,
            chartCol.day,
        );
        const seun = checkTargetSeun(solarBirth, daeun[0].daeunNum, chartCol.year, chartCol.day);
        const needOhaeng = checkNeedOhaeng(ohaengStrength, ohaengTemp);

        return {
            chartCol: chartCol ?? null,
            point: createInfoData(chartCol),
            ohaengStrength,
            ohaengTemp,
            needOhaeng,
            yearOhaeng: checkYearOheang(dayjs().year(), solarBirthDate.year, daeun[0]),
            sinsal: checkSinsalData(chartCol),
            daeun: daeun,
            seun: seun,
        };
    } else {
        return null;
    }
};

export const createBirthChartColData = (
    correctBirth: CorrectBirthDay,
    solarBirth: Dayjs,
    targetYear: number,
    targetDivision: DivisionJsonData[],
): BirthColumnGroup<BirthColumnData> => {
    //targetYear && targetDivision
    const _yearColumn = calculateYearColumn(targetYear);
    const _monthColumn = calculateMonthColumn(solarBirth, _yearColumn.gan, targetDivision);
    const _dayColumn = calculateDayColumn(solarBirth);
    const _timeColumn = correctBirth.time
        ? calculateTimeColumn(
              correctBirth.date,
              correctBirth.time,
              _dayColumn.gan,
              correctBirth.isCalculateDate,
          )
        : null;

    const _columnRelation = columnRelation(_yearColumn, _monthColumn, _dayColumn, _timeColumn);

    const _columnSipsin = columnSipsinData(_yearColumn, _monthColumn, _dayColumn, _timeColumn);
    const _columnCheonDuplication = checkDuplication(
        _yearColumn.gan,
        _monthColumn.gan,
        _dayColumn.gan,
        _timeColumn ? _timeColumn.gan : null,
    );
    const _columnJijiDuplication = checkDuplication(
        _yearColumn.jiji,
        _monthColumn.jiji,
        _dayColumn.jiji,
        _timeColumn ? _timeColumn.jiji : null,
    );

    return {
        year: {
            ..._yearColumn,
            ganRelation: _columnRelation.year.gan,
            jijiRelation: _columnRelation.year.jiji,
            woonsung: woonsung[_yearColumn.gan][_yearColumn.jiji],
            sinsal: null,
            ganSipsin: _columnSipsin.year.gan,
            jijiSipsin: _columnSipsin.year.jiji,
            ganDuplication: _columnCheonDuplication.year,
            jijiDuplication: _columnJijiDuplication.year,
        },
        month: {
            ..._monthColumn,
            ganRelation: _columnRelation.month.gan,
            jijiRelation: _columnRelation.month.jiji,
            woonsung: woonsung[_monthColumn.gan][_monthColumn.jiji],
            sinsal: check12Sinsal(_yearColumn.jiji, _monthColumn.jiji),
            ganSipsin: _columnSipsin.month.gan,
            jijiSipsin: _columnSipsin.month.jiji,
            ganDuplication: _columnCheonDuplication.month,
            jijiDuplication: _columnJijiDuplication.month,
        },
        day: {
            ..._dayColumn,
            ganRelation: _columnRelation.day.gan,
            jijiRelation: _columnRelation.day.jiji,
            woonsung: woonsung[_dayColumn.gan][_dayColumn.jiji],
            sinsal: check12Sinsal(_yearColumn.jiji, _dayColumn.jiji),
            ganSipsin: null,
            jijiSipsin: _columnSipsin.day.jiji,
            ganDuplication: _columnCheonDuplication.day,
            jijiDuplication: _columnJijiDuplication.day,
        },
        time:
            _timeColumn && _columnRelation.time
                ? {
                      ..._timeColumn,
                      ganRelation: _columnRelation.time.gan,
                      jijiRelation: _columnRelation.time.jiji,
                      woonsung: woonsung[_timeColumn.gan][_timeColumn.jiji],
                      sinsal: check12Sinsal(_yearColumn.jiji, _timeColumn.jiji),
                      ganSipsin: _columnSipsin.time ? _columnSipsin.time.gan : null,
                      jijiSipsin: _columnSipsin.time ? _columnSipsin.time.jiji : null,
                      ganDuplication: _columnCheonDuplication.time,
                      jijiDuplication: _columnJijiDuplication.time,
                  }
                : null,
    };
};

export const correctBirthDay = (
    birthDateTime: string,
    region: RegionJsonData,
    isDivideTime: boolean,
): CorrectBirthDay => {
    const zoned = dayjs.tz(birthDateTime, region.timezone);

    // DST 보정 - 기준점 (썸머타임이 보통 없는 1월 1일의 오프셋과 현재 오프셋 비교 해서 썸머타임 계산)
    const januaryOffset = dayjs.tz(`${zoned.year()}-01-01`, region.timezone).utcOffset();
    const summertimeMinutes = (zoned.utcOffset() - januaryOffset) * -1;

    // UTC offset → 표준 자오선 / 경도 보정
    const utcOffset = zoned.utcOffset() / 60; // minutes → hours
    const standardMeridian = utcOffset * 15;
    const deltaMinutes = (region.longitude - standardMeridian) * 4;

    const finalMinutes = deltaMinutes + summertimeMinutes;

    // 태양시 계산
    const solarTime = zoned.add(finalMinutes, 'minute');
    let date = solarTime.format('YYYY-MM-DD');
    const time = solarTime.format('HH:mm');

    /**
     * 야자시 / 조자시 적용
     * 1. 전통방식: 자시에 해당하는 경우 다음날로 처리
     * 2. 야/조자시 적용: 00시 기준 이전이면 전날 00시 이후면 다음날 처리
     */

    //전통방식인 경우 적용
    let isCalculateDate = false;
    if (!isDivideTime) {
        const yajasiStartTime = dayjs(
            `${date}T${jiji['자'].startTime}`,
            'YYYY-MM-DDTHH:mm',
        ).subtract(1, 'days');
        const yajasiEndTime = dayjs(`${date}T00:00`, 'YYYY-MM-DDTHH:mm');

        if (solarTime.isSameOrAfter(yajasiStartTime) && solarTime.isBefore(yajasiEndTime)) {
            isCalculateDate = true;
            date = solarTime.add(1, 'days').format('YYYY-MM-DD');
        }
    }

    return {
        date: date,
        time: time,
        deltaMinutes: finalMinutes,
        summertimeMinutes: summertimeMinutes,
        isCalculateDate: isCalculateDate,
    };
};

export const createSolarBirthData = (
    birthday: string,
    calendarType: 'solar' | 'lunar' | 'leap',
) => {
    const calendar = new KoreanLunarCalendar();

    const splitBirthday = birthday.split('-').map((item) => Number(item));

    if (calendarType === 'solar') {
        calendar.setSolarDate(splitBirthday[0], splitBirthday[1], splitBirthday[2]);
    } else {
        calendar.setLunarDate(
            splitBirthday[0],
            splitBirthday[1],
            splitBirthday[2],
            calendarType === 'leap',
        );
    }

    return calendar.getSolarCalendar();
};

/** 보정연도 및 절기데이터 */
export const calculateYearDivision = (solarBirth: Dayjs): CorrectTargetDivision => {
    const targetSpringDate = division24Json.filter((item) => {
        return item.sol_year === String(solarBirth.year()) && item.date_name === '입춘';
    });

    const targetSpringday = dayjs(
        `${targetSpringDate[0].locdate}T${targetSpringDate[0].kst}`,
        'YYYYMMDDTHHmm',
    );

    const solarYear = solarBirth.year();
    const solarMonth = solarBirth.month() + 1;
    const targetDivision = division24Json.filter((item) => {
        const itemYear = Number(item.sol_year);
        if (!item.is_beginning) return false;

        // 기본: 같은 연도
        if (itemYear === solarYear) return true;

        // 1월이면 전년도 12월 포함
        if (solarMonth === 1 && itemYear === solarYear - 1) {
            return item.sol_month === '12';
        }

        // 12월이면 다음년도 1월 포함
        if (solarMonth === 12 && itemYear === solarYear + 1) {
            return item.sol_month === '01';
        }

        return false;
    });

    return {
        targetYear: solarBirth.isBefore(targetSpringday) ? solarYear - 1 : solarYear,
        targetDivision: targetDivision,
    };
};

/**
 * 년주계산
 */
export const calculateYearColumn = (
    targetYear: number,
): BirthColumnItem<CheonganType, JijiType> => {
    const standardDate = dayjs('1900-01-01', 'YYYY-mm-dd');
    const standardYear = standardDate.year();
    const standardGan = '경'; // number = 6
    const standardJi = '자'; // number = 1

    const distanceStandard = targetYear - standardYear;
    const yearCheongan = Object.entries(cheongan).find(
        ([key, value]) => value.number === (cheongan[standardGan].number + distanceStandard) % 10,
    )?.[0];

    const yearJiji = Object.entries(jiji).find(
        ([key, value]) => value.number === (jiji[standardJi].number + distanceStandard) % 12,
    )?.[0];

    return {
        gan: yearCheongan as CheonganType,
        jiji: yearJiji as JijiType,
    };
};

/**
 * 월주계산
 */
export const calculateMonthColumn = (
    solarBirth: Dayjs,
    yearCheongan: CheonganType,
    targetDivision: DivisionJsonData[],
): BirthColumnItem<CheonganType, JijiType> => {
    let divisionName: string = '대설';

    for (let idx = 0; idx < targetDivision.length; idx++) {
        const item = targetDivision[idx];
        const targetDay = dayjs(item.locdate, 'YYYYMMDD');

        if (idx !== targetDivision.length - 1) {
            const after = targetDivision[idx + 1];
            const afterDay = dayjs(after.locdate, 'YYYYMMDD');

            if (solarBirth.isSameOrAfter(targetDay) && solarBirth.isBefore(afterDay)) {
                divisionName = item.date_name;
                break;
            }
        }
    }

    const defaultMonthCheongan = findMonthCheongan(yearCheongan);
    const monthJiji = division24[divisionName as DivisionType].jiji;
    const distance = (12 + jiji[monthJiji].number - 2) % 12;
    const monthGan = Object.entries(cheongan).find(
        ([key, value]) => value.number === (cheongan[defaultMonthCheongan].number + distance) % 10,
    )?.[0];

    return {
        gan: monthGan as CheonganType,
        jiji: monthJiji,
    };
};

/**
 * 일주계산
 */
export const calculateDayColumn = (solarBirth: Dayjs): BirthColumnItem<CheonganType, JijiType> => {
    const standardDate = dayjs('1900-01-01', 'YYYY-mm-dd');
    const standardGan = '갑'; // number = 0
    const standardJi = '술'; // number = 10
    const diffDays = solarBirth.startOf('day').diff(standardDate.startOf('day'), 'day') + 1;

    const dayGan = Object.entries(cheongan).find(
        ([key, value]) => value.number === (10 + cheongan[standardGan].number + diffDays) % 10,
    )?.[0];

    const dayJiji = Object.entries(jiji).find(
        ([key, value]) => value.number === (12 + jiji[standardJi].number + diffDays) % 12,
    )?.[0];

    return {
        gan: dayGan as CheonganType,
        jiji: dayJiji as JijiType,
    };
};

/**
 * 시주계산
 */
export const calculateTimeColumn = (
    date: string,
    time: string | null,
    dayCheongan: CheonganType,
    isCalculateDate: boolean,
): BirthColumnItem<CheonganType, JijiType> => {
    const birthDateTime = dayjs(`${date}T${time}`, 'YYYY-MM-DDTHH:mm');

    const timeJiji =
        !isCalculateDate &&
        (Object.entries(jiji).find(([key, value]) => {
            const startDateTime = dayjs(`${date}T${value.startTime}`, 'YYYY-MM-DDTHH:mm');
            const endDateTime = dayjs(`${date}T${value.endTime}`, 'YYYY-MM-DDTHH:mm');

            if (key === '자') {
                return (
                    (birthDateTime.isSameOrAfter(startDateTime.subtract(1, 'day')) &&
                        birthDateTime.isBefore(endDateTime)) ||
                    (birthDateTime.isSameOrAfter(startDateTime) &&
                        birthDateTime.isBefore(endDateTime.add(1, 'day')))
                );
            } else {
                return (
                    birthDateTime.isSameOrAfter(startDateTime) &&
                    birthDateTime.isBefore(endDateTime)
                );
            }
        })?.[0] ??
            '자');

    const timeGan = findTimeCheongan(dayCheongan, timeJiji as JijiType);

    return {
        gan: timeGan as CheonganType,
        jiji: timeJiji as JijiType,
    };
};

export const findMonthCheongan = (yearCheongan: CheonganType) => {
    switch (yearCheongan) {
        case '갑':
        case '기':
            return '병';

        case '을':
        case '경':
            return '무';

        case '병':
        case '신':
            return '경';

        case '정':
        case '임':
            return '임';

        default:
            return '갑';
    }
};

export const findTimeCheongan = (dayCheongan: CheonganType, timeJiji: JijiType) => {
    const cheonganArr: string[] = Object.keys(cheongan);

    switch (dayCheongan) {
        case '갑':
        case '기':
            return cheonganArr[jiji[timeJiji].number % 10];
        case '을':
        case '경':
            return cheonganArr[(2 + jiji[timeJiji].number) % 10];
        case '병':
        case '신':
            return cheonganArr[(4 + jiji[timeJiji].number) % 10];
        case '정':
        case '임':
            return cheonganArr[(6 + jiji[timeJiji].number) % 10];
        default:
            return cheonganArr[(8 + jiji[timeJiji].number) % 10];
    }
};
