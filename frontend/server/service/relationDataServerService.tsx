/** Lib */

/** Custom */
import { cheonganRelation } from '@/common/const/cheonganConst';
import { jijiRelation } from '@/common/const/jijiConst';

/** Type & Interface */
import { CheonganType, JijiType } from '@/common/type/basicType';
import { Relation } from '@/common/type/birthDataInterface';
import { BirthColumnGroup, BirthColumnItem } from '@/common/type/baseInterface';

export const columnRelation = (
    year: BirthColumnItem<CheonganType, JijiType>,
    month: BirthColumnItem<CheonganType, JijiType>,
    day: BirthColumnItem<CheonganType, JijiType>,
    time: BirthColumnItem<CheonganType, JijiType> | null,
): BirthColumnGroup<BirthColumnItem<Relation[], Relation[]>> => {
    const _checkCheonganRelation = checkCheonganRelation(
        year.gan,
        month.gan,
        day.gan,
        time ? time.gan : null,
    );

    const _checkJijiYukhapRelation = checkJijiYukhapRelation(
        year.jiji,
        month.jiji,
        day.jiji,
        time ? time.jiji : null,
    );

    const _checkJijiBanghapRelation = checkJijiBanghapRelation(
        year.jiji,
        month.jiji,
        day.jiji,
        time ? time.jiji : null,
    );

    const _checkJijiSamhapRelation = checkJijiSamhapRelation(
        year.jiji,
        month.jiji,
        day.jiji,
        time ? time.jiji : null,
    );

    const _checkJijiYukChungRelation = checkJijiYukChungRelation(
        year.jiji,
        month.jiji,
        day.jiji,
        time ? time.jiji : null,
    );

    const _checkJijiSamhyungRelation = checkJijiSamhyungRelation(
        year.jiji,
        month.jiji,
        day.jiji,
        time ? time.jiji : null,
    );

    const _checkJijiHyungRelation = checkJijiHyungRelation(
        year.jiji,
        month.jiji,
        day.jiji,
        time ? time.jiji : null,
    );

    const _checkJijiHaeRelation = checkJijiHaeRelation(
        year.jiji,
        month.jiji,
        day.jiji,
        time ? time.jiji : null,
    );

    const _checkJijiPaRelation = checkJijiPaRelation(
        year.jiji,
        month.jiji,
        day.jiji,
        time ? time.jiji : null,
    );

    return {
        year: {
            gan: [..._checkCheonganRelation.year],
            jiji: [
                ..._checkJijiYukhapRelation.year,
                ..._checkJijiBanghapRelation.year,
                ..._checkJijiSamhapRelation.year,
                ..._checkJijiYukChungRelation.year,
                ..._checkJijiSamhyungRelation.year,
                ..._checkJijiHyungRelation.year,
                ..._checkJijiHaeRelation.year,
                ..._checkJijiPaRelation.year,
            ],
        },
        month: {
            gan: [..._checkCheonganRelation.month],
            jiji: [
                ..._checkJijiYukhapRelation.month,
                ..._checkJijiBanghapRelation.month,
                ..._checkJijiSamhapRelation.month,
                ..._checkJijiYukChungRelation.month,
                ..._checkJijiSamhyungRelation.month,
                ..._checkJijiHyungRelation.month,
                ..._checkJijiHaeRelation.month,
                ..._checkJijiPaRelation.month,
            ],
        },
        day: {
            gan: [..._checkCheonganRelation.day],
            jiji: [
                ..._checkJijiYukhapRelation.day,
                ..._checkJijiBanghapRelation.day,
                ..._checkJijiSamhapRelation.day,
                ..._checkJijiYukChungRelation.day,
                ..._checkJijiSamhyungRelation.day,
                ..._checkJijiHyungRelation.day,
                ..._checkJijiHaeRelation.day,
                ..._checkJijiPaRelation.day,
            ],
        },
        time: time
            ? {
                  gan: [...(_checkCheonganRelation.time ?? [])],
                  jiji: [
                      ...(_checkJijiYukhapRelation.time ?? []),
                      ...(_checkJijiBanghapRelation.time ?? []),
                      ...(_checkJijiSamhapRelation.time ?? []),
                      ...(_checkJijiYukChungRelation.time ?? []),
                      ...(_checkJijiSamhyungRelation.time ?? []),
                      ...(_checkJijiHyungRelation.time ?? []),
                      ...(_checkJijiHaeRelation.time ?? []),
                      ...(_checkJijiPaRelation.time ?? []),
                  ],
              }
            : null,
    };
};

const checkCheonganRelation = (
    yearGan: CheonganType,
    monthGan: CheonganType,
    dayGan: CheonganType,
    timeGan: CheonganType | null,
) => {
    const yearGanObj = cheonganRelation[yearGan];
    const monthGanObj = cheonganRelation[monthGan];
    const dayGanObj = cheonganRelation[dayGan];

    const relationList: BirthColumnGroup<Relation[]> = {
        year: [],
        month: [],
        day: [],
        time: [],
    };

    /** 합(중복 안됨) */
    //일간과 월간이 합
    if (dayGanObj.hap === monthGan) {
        relationList.month.push({ name: dayGanObj.hapName, isClose: true, columnName: '월_일' });
        relationList.day.push({ name: dayGanObj.hapName, isClose: true, columnName: '월_일' });

        //연간과 시간이 합
        if (timeGan && yearGanObj.hap === timeGan) {
            relationList.year.push({
                name: yearGanObj.hapName,
                isClose: false,
                columnName: '년_시',
            });
            relationList.time?.push({
                name: yearGanObj.hapName,
                isClose: false,
                columnName: '년_시',
            });
        }
    }

    //일간과 시간 합
    else if (timeGan && dayGanObj.hap === timeGan) {
        relationList.day.push({ name: dayGanObj.hapName, isClose: true, columnName: '일_시' });
        relationList.time?.push({
            name: dayGanObj.hapName,
            isClose: true,
            columnName: '일_시',
        });

        //연간과 월간 합
        if (yearGanObj.hap === monthGan) {
            relationList.year.push({
                name: yearGanObj.hapName,
                isClose: true,
                columnName: '년_월',
            });
            relationList.month.push({
                name: yearGanObj.hapName,
                isClose: true,
                columnName: '년_월',
            });
        }
    }

    //일간과 연간 합
    else if (dayGanObj.hap === yearGan) {
        relationList.day.push({ name: dayGanObj.hapName, isClose: false, columnName: '년_일' });
        relationList.year.push({
            name: dayGanObj.hapName,
            isClose: false,
            columnName: '년_일',
        });

        //월간과 시간 합
        if (timeGan && monthGanObj.hap === timeGan) {
            relationList.month.push({
                name: monthGanObj.hapName,
                isClose: false,
                columnName: '월_시',
            });

            relationList.time?.push({
                name: monthGanObj.hapName,
                isClose: false,
                columnName: '월_시',
            });
        }
    } else {
        //월간과 연간 합
        if (monthGanObj.hap === yearGan) {
            relationList.year.push({
                name: yearGanObj.hapName,
                isClose: true,
                columnName: '년_월',
            });
            relationList.month.push({
                name: yearGanObj.hapName,
                isClose: true,
                columnName: '년_월',
            });
        }

        //월간과 시간 합
        else if (timeGan && monthGanObj.hap === timeGan) {
            relationList.month.push({
                name: monthGanObj.hapName,
                isClose: false,
                columnName: '월_시',
            });

            relationList.time?.push({
                name: monthGanObj.hapName,
                isClose: false,
                columnName: '월_시',
            });
        }

        //연간과 시간이 합
        else if (timeGan && yearGanObj.hap === timeGan) {
            relationList.year.push({
                name: yearGanObj.hapName,
                isClose: false,
                columnName: '년_시',
            });
            relationList.time?.push({
                name: yearGanObj.hapName,
                isClose: false,
                columnName: '년_시',
            });
        }
    }

    /** 충(중복 안됨) */
    //일간과 월간이 충
    if (dayGanObj.chung === monthGan) {
        relationList.month.push({ name: dayGanObj.chungName, isClose: true, columnName: '월_일' });
        relationList.day.push({ name: dayGanObj.chungName, isClose: true, columnName: '월_일' });

        //연간과 시간이 충
        if (timeGan && yearGanObj.chung === timeGan) {
            relationList.year.push({
                name: yearGanObj.chungName,
                isClose: false,
                columnName: '년_시',
            });
            relationList.time?.push({
                name: yearGanObj.chungName,
                isClose: false,
                columnName: '년_시',
            });
        }
    }

    //일간과 시간 충
    else if (timeGan && dayGanObj.chung === timeGan) {
        relationList.day.push({ name: dayGanObj.chungName, isClose: true, columnName: '일_시' });
        relationList.time?.push({
            name: dayGanObj.chungName,
            isClose: true,
            columnName: '일_시',
        });

        //연간과 월간 충
        if (yearGanObj.chung === monthGan) {
            relationList.year.push({
                name: yearGanObj.chungName,
                isClose: true,
                columnName: '년_월',
            });
            relationList.month.push({
                name: yearGanObj.chungName,
                isClose: true,
                columnName: '년_월',
            });
        }
    }

    //일간과 연간 충
    else if (dayGanObj.chung === yearGan) {
        relationList.day.push({ name: dayGanObj.chungName, isClose: false, columnName: '년_일' });
        relationList.year.push({
            name: dayGanObj.chungName,
            isClose: false,
            columnName: '년_일',
        });

        //월간과 시간 충
        if (timeGan && monthGanObj.chung === timeGan) {
            relationList.month.push({
                name: monthGanObj.chungName,
                isClose: false,
                columnName: '월_시',
            });

            relationList.time?.push({
                name: monthGanObj.chungName,
                isClose: false,
                columnName: '월_시',
            });
        }
    } else {
        //월간과 연간 충
        if (monthGanObj.chung === yearGan) {
            relationList.year.push({
                name: yearGanObj.chungName,
                isClose: true,
                columnName: '년_월',
            });
            relationList.month.push({
                name: yearGanObj.chungName,
                isClose: true,
                columnName: '년_월',
            });
        }

        //월간과 시간 충
        else if (timeGan && monthGanObj.chung === timeGan) {
            relationList.month.push({
                name: monthGanObj.chungName,
                isClose: false,
                columnName: '월_시',
            });

            relationList.time?.push({
                name: monthGanObj.chungName,
                isClose: false,
                columnName: '월_시',
            });
        }

        //연간과 시간이 충
        else if (timeGan && yearGanObj.chung === timeGan) {
            relationList.year.push({
                name: yearGanObj.chungName,
                isClose: false,
                columnName: '년_시',
            });
            relationList.time?.push({
                name: yearGanObj.chungName,
                isClose: false,
                columnName: '년_시',
            });
        }
    }

    return relationList;
};

const checkJijiYukhapRelation = (
    yearJi: JijiType,
    monthJi: JijiType,
    dayJi: JijiType,
    timeJi: JijiType | null,
) => {
    const yearJiObj = jijiRelation[yearJi];
    const dayJiObj = jijiRelation[dayJi];

    const relationList: BirthColumnGroup<Relation[]> = {
        year: [],
        month: [],
        day: [],
        time: [],
    };

    /** 합(중복 안됨, 위치 이웃) */
    //일지와 월지가 합
    if (dayJiObj.yukhap === monthJi) {
        relationList.month.push({ name: dayJiObj.yukhapName, isClose: true, columnName: '월_일' });
        relationList.day.push({ name: dayJiObj.yukhapName, isClose: true, columnName: '월_일' });
    }

    //일지와 시지 합
    else if (timeJi && dayJiObj.yukhap === timeJi) {
        relationList.day.push({ name: dayJiObj.yukhapName, isClose: true, columnName: '월_시' });
        relationList.time?.push({ name: dayJiObj.yukhapName, isClose: true, columnName: '월_시' });

        //연지와 월지 합
        if (yearJiObj.yukhap === monthJi) {
            relationList.year.push({
                name: yearJiObj.yukhapName,
                isClose: true,
                columnName: '년_월',
            });
            relationList.month.push({
                name: yearJiObj.yukhapName,
                isClose: true,
                columnName: '년_월',
            });
        }
    } else {
        //연지와 월지 합
        if (yearJiObj.yukhap === monthJi) {
            relationList.year.push({
                name: yearJiObj.yukhapName,
                isClose: true,
                columnName: '년_월',
            });
            relationList.month.push({
                name: yearJiObj.yukhapName,
                isClose: true,
                columnName: '년_월',
            });
        }
    }

    return relationList;
};

const checkJijiBanghapRelation = (
    yearJi: JijiType,
    monthJi: JijiType,
    dayJi: JijiType,
    timeJi: JijiType | null,
) => {
    const yearJiObj = jijiRelation[yearJi];
    const dayJiObj = jijiRelation[dayJi];

    let columnNameList = ['년_월_일'];
    if (timeJi) columnNameList = [...columnNameList, '월_일_시', '년_월_시', '년_일_시'];

    const relationList: BirthColumnGroup<Relation[]> = {
        year: [],
        month: [],
        day: [],
        time: [],
    };

    //하나라도 해당되면 stop
    let isBanghap = false;

    for (let i = 0; i < columnNameList.length; i++) {
        const item = columnNameList[i];
        if (item.includes('일')) {
            const _data = {
                name: dayJiObj.samhap.join() + ' 삼합',
                isClose: true,
                columnName: item,
            };

            if (
                item === '월_일_시' &&
                timeJi &&
                hasSamhapOrhyung(dayJiObj.samhap, [monthJi, dayJi, timeJi])
            ) {
                relationList.month.push(_data);
                relationList.day.push(_data);
                relationList.time?.push(_data);
                isBanghap = true;
            } else if (
                item === '년_월_일' &&
                hasSamhapOrhyung(dayJiObj.samhap, [yearJi, monthJi, dayJi])
            ) {
                relationList.year.push(_data);
                relationList.month.push(_data);
                relationList.day.push(_data);
                isBanghap = true;
            } else if (
                item === '년_일_시' &&
                timeJi &&
                hasSamhapOrhyung(dayJiObj.samhap, [yearJi, dayJi, timeJi])
            ) {
                relationList.year.push(_data);
                relationList.day.push(_data);
                relationList.time?.push(_data);
                isBanghap = true;
            }
        } else {
            const _yeardata = {
                name: yearJiObj.samhap.join() + ' 삼합',
                isClose: true,
                columnName: item,
            };
            if (
                item === '년_월_시' &&
                timeJi &&
                hasSamhapOrhyung(yearJiObj.samhap, [yearJi, monthJi, timeJi])
            ) {
                relationList.year.push(_yeardata);
                relationList.month.push(_yeardata);
                relationList.time?.push(_yeardata);
                isBanghap = true;
            }
        }

        if (isBanghap) break;
    }

    return relationList;
};

const checkJijiSamhapRelation = (
    yearJi: JijiType,
    monthJi: JijiType,
    dayJi: JijiType,
    timeJi: JijiType | null,
) => {
    const yearJiObj = jijiRelation[yearJi];
    const monthJiObj = jijiRelation[monthJi];
    const dayJiObj = jijiRelation[dayJi];

    let columnNameList = ['년_월_일'];
    if (timeJi) columnNameList = [...columnNameList, '월_일_시', '년_월_시', '년_일_시'];

    const relationList: BirthColumnGroup<Relation[]> = {
        year: [],
        month: [],
        day: [],
        time: [],
    };

    let isSamhap = false;

    //하나라도 해당되면 stop
    for (let i = 0; i < columnNameList.length; i++) {
        const item = columnNameList[i];
        if (item.includes('일')) {
            const _data = {
                name: dayJiObj.samhap.join() + ' 삼합',
                isClose: true,
                columnName: item,
            };

            if (
                item === '월_일_시' &&
                timeJi &&
                hasSamhapOrhyung(dayJiObj.samhap, [monthJi, dayJi, timeJi])
            ) {
                relationList.month.push(_data);
                relationList.day.push(_data);
                relationList.time?.push(_data);
                isSamhap = true;
            } else if (
                item === '년_월_일' &&
                hasSamhapOrhyung(dayJiObj.samhap, [yearJi, monthJi, dayJi])
            ) {
                relationList.year.push(_data);
                relationList.month.push(_data);
                relationList.day.push(_data);
                isSamhap = true;
            } else if (
                item === '년_일_시' &&
                timeJi &&
                hasSamhapOrhyung(dayJiObj.samhap, [yearJi, dayJi, timeJi])
            ) {
                relationList.year.push(_data);
                relationList.day.push(_data);
                relationList.time?.push(_data);
                isSamhap = true;
            }
        } else {
            const _yeardata = {
                name: yearJiObj.samhap.join() + ' 삼합',
                isClose: true,
                columnName: item,
            };
            if (
                item === '년_월_시' &&
                timeJi &&
                hasSamhapOrhyung(yearJiObj.samhap, [yearJi, monthJi, timeJi])
            ) {
                relationList.year.push(_yeardata);
                relationList.month.push(_yeardata);
                relationList.time?.push(_yeardata);
                isSamhap = true;
            }
        }

        if (isSamhap) break;
    }

    if (!isSamhap) {
        //일지와 월지 합
        if (hasBanhapOrHyung(dayJiObj.samhap, dayJiObj.samhapWangji, dayJi, monthJi)) {
            const _data = {
                name: dayJiObj.samhap.join() + ' 반합',
                isClose: true,
                columnName: '월_일',
            };

            relationList.month.push(_data);
            relationList.day.push(_data);

            //연지와 시지 합
            if (
                timeJi &&
                hasBanhapOrHyung(yearJiObj.samhap, yearJiObj.samhapWangji, yearJi, timeJi)
            ) {
                const _data = {
                    name: yearJiObj.samhap.join() + ' 반합',
                    isClose: false,
                    columnName: '년_시',
                };

                relationList.year.push(_data);
                relationList.time?.push(_data);
            }
        }

        //일지와 시지 합
        else if (
            timeJi &&
            hasBanhapOrHyung(dayJiObj.samhap, dayJiObj.samhapWangji, dayJi, timeJi)
        ) {
            const _data = {
                name: dayJiObj.samhap.join() + ' 반합',
                isClose: true,
                columnName: '일_시',
            };

            relationList.day.push(_data);
            relationList.time?.push(_data);

            //연지과 월지 합
            if (hasBanhapOrHyung(yearJiObj.samhap, yearJiObj.samhapWangji, yearJi, monthJi)) {
                const _data = {
                    name: yearJiObj.samhap.join() + ' 반합',
                    isClose: true,
                    columnName: '년_월',
                };

                relationList.year.push(_data);
                relationList.month.push(_data);
            }
        }

        //일지와 연지의 합
        else if (hasBanhapOrHyung(dayJiObj.samhap, dayJiObj.samhapWangji, dayJi, yearJi)) {
            const _data = {
                name: dayJiObj.samhap.join() + ' 반합',
                isClose: false,
                columnName: '년_일',
            };

            relationList.day.push(_data);
            relationList.year.push(_data);

            //월지와 시지 합
            if (
                timeJi &&
                hasBanhapOrHyung(monthJiObj.samhap, monthJiObj.samhapWangji, monthJi, timeJi)
            ) {
                const _data = {
                    name: monthJiObj.samhap.join() + ' 반합',
                    isClose: false,
                    columnName: '월_시',
                };

                relationList.month.push(_data);
                relationList.time?.push(_data);
            }
        } else {
            //연지과 월지 합
            if (hasBanhapOrHyung(yearJiObj.samhap, yearJiObj.samhapWangji, yearJi, monthJi)) {
                const _data = {
                    name: yearJiObj.samhap.join() + ' 반합',
                    isClose: true,
                    columnName: '년_월',
                };

                relationList.year.push(_data);
                relationList.month.push(_data);
            }

            //월지와 시지 합
            if (
                timeJi &&
                hasBanhapOrHyung(monthJiObj.samhap, monthJiObj.samhapWangji, monthJi, timeJi)
            ) {
                const _data = {
                    name: monthJiObj.samhap.join() + ' 반합',
                    isClose: false,
                    columnName: '월_시',
                };

                relationList.month.push(_data);
                relationList.time?.push(_data);
            }

            //연지와 시지 합
            if (
                timeJi &&
                hasBanhapOrHyung(yearJiObj.samhap, yearJiObj.samhapWangji, yearJi, timeJi)
            ) {
                const _data = {
                    name: yearJiObj.samhap.join() + ' 반합',
                    isClose: false,
                    columnName: '년_시',
                };

                relationList.year.push(_data);
                relationList.time?.push(_data);
            }
        }
    }

    return relationList;
};

const checkJijiYukChungRelation = (
    yearJi: JijiType,
    monthJi: JijiType,
    dayJi: JijiType,
    timeJi: JijiType | null,
) => {
    const yearJiObj = jijiRelation[yearJi];
    const dayJiObj = jijiRelation[dayJi];

    const relationList: BirthColumnGroup<Relation[]> = {
        year: [],
        month: [],
        day: [],
        time: [],
    };

    /** 충(중복 안됨, 위치 이웃) */
    //일지와 월지가 충
    if (dayJiObj.chung === monthJi) {
        relationList.month.push({ name: dayJiObj.chungName, isClose: true, columnName: '월_일' });
        relationList.day.push({ name: dayJiObj.chungName, isClose: true, columnName: '월_일' });
    }

    //일지와 시지 충
    else if (timeJi && dayJiObj.chung === timeJi) {
        relationList.day.push({ name: dayJiObj.chungName, isClose: true, columnName: '월_시' });
        relationList.time?.push({ name: dayJiObj.chungName, isClose: true, columnName: '월_시' });

        //연지와 월지 충
        if (yearJiObj.chung === monthJi) {
            relationList.year.push({
                name: yearJiObj.chungName,
                isClose: true,
                columnName: '년_월',
            });
            relationList.month.push({
                name: yearJiObj.chungName,
                isClose: true,
                columnName: '년_월',
            });
        }
    } else {
        //연지와 월지 충
        if (yearJiObj.chung === monthJi) {
            relationList.year.push({
                name: yearJiObj.chungName,
                isClose: true,
                columnName: '년_월',
            });
            relationList.month.push({
                name: yearJiObj.chungName,
                isClose: true,
                columnName: '년_월',
            });
        }
    }

    return relationList;
};

const checkJijiSamhyungRelation = (
    yearJi: JijiType,
    monthJi: JijiType,
    dayJi: JijiType,
    timeJi: JijiType | null,
) => {
    const yearJiObj = jijiRelation[yearJi];
    const monthJiObj = jijiRelation[monthJi];
    const dayJiObj = jijiRelation[dayJi];

    let columnNameList = ['년_월_일'];
    if (timeJi) columnNameList = [...columnNameList, '월_일_시', '년_월_시', '년_일_시'];

    const relationList: BirthColumnGroup<Relation[]> = {
        year: [],
        month: [],
        day: [],
        time: [],
    };

    let isSamhyung = false;

    //하나라도 해당되면 stop
    for (let i = 0; i < columnNameList.length; i++) {
        const item = columnNameList[i];
        if (item.includes('일')) {
            const _data = {
                name: dayJiObj.samhyung.join() + ' 삼형',
                isClose: true,
                columnName: item,
            };

            if (
                item === '월_일_시' &&
                timeJi &&
                hasSamhapOrhyung(dayJiObj.samhyung, [monthJi, dayJi, timeJi])
            ) {
                relationList.month.push(_data);
                relationList.day.push(_data);
                relationList.time?.push(_data);
                isSamhyung = true;
            } else if (
                item === '년_월_일' &&
                hasSamhapOrhyung(dayJiObj.samhyung, [yearJi, monthJi, dayJi])
            ) {
                relationList.year.push(_data);
                relationList.month.push(_data);
                relationList.day.push(_data);
                isSamhyung = true;
            } else if (
                item === '년_일_시' &&
                timeJi &&
                hasSamhapOrhyung(dayJiObj.samhyung, [yearJi, dayJi, timeJi])
            ) {
                relationList.year.push(_data);
                relationList.day.push(_data);
                relationList.time?.push(_data);
                isSamhyung = true;
            }
        } else {
            const _yeardata = {
                name: yearJiObj.samhyung.join() + ' 삼형',
                isClose: true,
                columnName: item,
            };
            if (
                item === '년_월_시' &&
                timeJi &&
                hasSamhapOrhyung(yearJiObj.samhyung, [yearJi, monthJi, timeJi])
            ) {
                relationList.year.push(_yeardata);
                relationList.month.push(_yeardata);
                relationList.time?.push(_yeardata);
                isSamhyung = true;
            }
        }

        if (isSamhyung) break;
    }

    if (!isSamhyung) {
        //일지와 월지 형
        if (hasBanhapOrHyung(dayJiObj.samhyung, null, dayJi, monthJi)) {
            const _data = {
                name: dayJiObj.samhyung.join() + ' 반형',
                isClose: true,
                columnName: '월_일',
            };

            relationList.month.push(_data);
            relationList.day.push(_data);

            //연지와 시지 합
            if (timeJi && hasBanhapOrHyung(yearJiObj.samhyung, null, yearJi, timeJi)) {
                const _data = {
                    name: yearJiObj.samhyung.join() + ' 반형',
                    isClose: false,
                    columnName: '년_시',
                };

                relationList.year.push(_data);
                relationList.time?.push(_data);
            }
        }

        //일지와 시지 합
        else if (timeJi && hasBanhapOrHyung(dayJiObj.samhyung, null, dayJi, timeJi)) {
            const _data = {
                name: dayJiObj.samhyung.join() + ' 반형',
                isClose: true,
                columnName: '일_시',
            };

            relationList.day.push(_data);
            relationList.time?.push(_data);

            //연지과 월지 합
            if (hasBanhapOrHyung(yearJiObj.samhyung, null, yearJi, monthJi)) {
                const _data = {
                    name: yearJiObj.samhyung.join() + ' 반형',
                    isClose: true,
                    columnName: '년_월',
                };

                relationList.year.push(_data);
                relationList.month.push(_data);
            }
        }

        //일지와 연지의 합
        else if (hasBanhapOrHyung(dayJiObj.samhyung, null, dayJi, yearJi)) {
            const _data = {
                name: dayJiObj.samhyung.join() + ' 반합',
                isClose: false,
                columnName: '년_일',
            };

            relationList.day.push(_data);
            relationList.year.push(_data);

            //월지와 시지 합
            if (timeJi && hasBanhapOrHyung(monthJiObj.samhyung, null, monthJi, timeJi)) {
                const _data = {
                    name: monthJiObj.samhyung.join() + ' 반합',
                    isClose: false,
                    columnName: '월_시',
                };

                relationList.month.push(_data);
                relationList.time?.push(_data);
            }
        } else {
            //연지과 월지 합
            if (hasBanhapOrHyung(yearJiObj.samhyung, null, yearJi, monthJi)) {
                const _data = {
                    name: yearJiObj.samhyung.join() + ' 반합',
                    isClose: true,
                    columnName: '년_월',
                };

                relationList.year.push(_data);
                relationList.month.push(_data);
            }

            //월지와 시지 합
            if (timeJi && hasBanhapOrHyung(monthJiObj.samhyung, null, monthJi, timeJi)) {
                const _data = {
                    name: monthJiObj.samhyung.join() + ' 반합',
                    isClose: false,
                    columnName: '월_시',
                };

                relationList.month.push(_data);
                relationList.time?.push(_data);
            }

            //연지와 시지 합
            if (timeJi && hasBanhapOrHyung(yearJiObj.samhyung, null, yearJi, timeJi)) {
                const _data = {
                    name: yearJiObj.samhyung.join() + ' 반합',
                    isClose: false,
                    columnName: '년_시',
                };

                relationList.year.push(_data);
                relationList.time?.push(_data);
            }
        }
    }

    return relationList;
};

const checkJijiHyungRelation = (
    yearJi: JijiType,
    monthJi: JijiType,
    dayJi: JijiType,
    timeJi: JijiType | null,
) => {
    const yearJiObj = jijiRelation[yearJi];
    const monthJiObj = jijiRelation[monthJi];
    const dayJiObj = jijiRelation[dayJi];

    const relationList: BirthColumnGroup<Relation[]> = {
        year: [],
        month: [],
        day: [],
        time: [],
    };

    /** 형(중복 안됨) */
    //일간과 월간이 형
    if (dayJiObj.hyung === monthJi) {
        relationList.month.push({ name: dayJiObj.hyungName, isClose: true, columnName: '월_일' });
        relationList.day.push({ name: dayJiObj.hyungName, isClose: true, columnName: '월_일' });

        //연간과 시간이 형
        if (timeJi && yearJiObj.hyung === timeJi) {
            relationList.year.push({
                name: yearJiObj.hyungName,
                isClose: false,
                columnName: '년_시',
            });
            relationList.time?.push({
                name: yearJiObj.hyungName,
                isClose: false,
                columnName: '년_시',
            });
        }
    }

    //일간과 시간 형
    else if (timeJi && dayJiObj.hyung === timeJi) {
        relationList.day.push({ name: dayJiObj.hyungName, isClose: true, columnName: '일_시' });
        relationList.time?.push({
            name: dayJiObj.hyungName,
            isClose: true,
            columnName: '일_시',
        });

        //연간과 월간 형
        if (yearJiObj.hyung === monthJi) {
            relationList.year.push({
                name: yearJiObj.hyungName,
                isClose: true,
                columnName: '년_월',
            });
            relationList.month.push({
                name: yearJiObj.hyungName,
                isClose: true,
                columnName: '년_월',
            });
        }
    }

    //일간과 연간 형
    else if (dayJiObj.hyung === yearJi) {
        relationList.day.push({ name: dayJiObj.hyungName, isClose: false, columnName: '년_일' });
        relationList.year.push({
            name: dayJiObj.hyungName,
            isClose: false,
            columnName: '년_일',
        });

        //월간과 시간 형
        if (timeJi && monthJiObj.hyung === timeJi) {
            relationList.month.push({
                name: monthJiObj.hyungName,
                isClose: false,
                columnName: '월_시',
            });

            relationList.time?.push({
                name: monthJiObj.hyungName,
                isClose: false,
                columnName: '월_시',
            });
        }
    } else {
        //월간과 연간 형
        if (monthJiObj.hyung === yearJi) {
            relationList.year.push({
                name: monthJiObj.hyungName,
                isClose: true,
                columnName: '년_월',
            });
            relationList.month.push({
                name: monthJiObj.hyungName,
                isClose: true,
                columnName: '년_월',
            });
        }

        //월간과 시간 형
        else if (timeJi && monthJiObj.hyung === timeJi) {
            relationList.month.push({
                name: monthJiObj.hyungName,
                isClose: false,
                columnName: '월_시',
            });

            relationList.time?.push({
                name: monthJiObj.hyungName,
                isClose: false,
                columnName: '월_시',
            });
        }

        //연간과 시간이 형
        else if (timeJi && yearJiObj.hyung === timeJi) {
            relationList.year.push({
                name: yearJiObj.hyungName,
                isClose: false,
                columnName: '년_시',
            });
            relationList.time?.push({
                name: yearJiObj.hyungName,
                isClose: false,
                columnName: '년_시',
            });
        }
    }

    return relationList;
};

const checkJijiHaeRelation = (
    yearJi: JijiType,
    monthJi: JijiType,
    dayJi: JijiType,
    timeJi: JijiType | null,
) => {
    const yearJiObj = jijiRelation[yearJi];
    const monthJiObj = jijiRelation[monthJi];
    const dayJiObj = jijiRelation[dayJi];

    const relationList: BirthColumnGroup<Relation[]> = {
        year: [],
        month: [],
        day: [],
        time: [],
    };

    /** 해(중복 안됨) */
    //일간과 월간이 해
    if (dayJiObj.hae === monthJi) {
        relationList.month.push({ name: dayJiObj.haeName, isClose: true, columnName: '월_일' });
        relationList.day.push({ name: dayJiObj.haeName, isClose: true, columnName: '월_일' });

        //연간과 시간이 해
        if (timeJi && yearJiObj.hae === timeJi) {
            relationList.year.push({
                name: yearJiObj.haeName,
                isClose: false,
                columnName: '년_시',
            });
            relationList.time?.push({
                name: yearJiObj.haeName,
                isClose: false,
                columnName: '년_시',
            });
        }
    }

    //일간과 시간 해
    else if (timeJi && dayJiObj.hae === timeJi) {
        relationList.day.push({ name: dayJiObj.haeName, isClose: true, columnName: '일_시' });
        relationList.time?.push({
            name: dayJiObj.haeName,
            isClose: true,
            columnName: '일_시',
        });

        //연간과 월간 해
        if (yearJiObj.hae === monthJi) {
            relationList.year.push({
                name: yearJiObj.haeName,
                isClose: true,
                columnName: '년_월',
            });
            relationList.month.push({
                name: yearJiObj.haeName,
                isClose: true,
                columnName: '년_월',
            });
        }
    }

    //일간과 연간 해
    else if (dayJiObj.hae === yearJi) {
        relationList.day.push({ name: dayJiObj.haeName, isClose: false, columnName: '년_일' });
        relationList.year.push({
            name: dayJiObj.haeName,
            isClose: false,
            columnName: '년_일',
        });

        //월간과 시간 해
        if (timeJi && monthJiObj.hae === timeJi) {
            relationList.month.push({
                name: monthJiObj.haeName,
                isClose: false,
                columnName: '월_시',
            });

            relationList.time?.push({
                name: monthJiObj.haeName,
                isClose: false,
                columnName: '월_시',
            });
        }
    } else {
        //월간과 연간 해
        if (monthJiObj.hae === yearJi) {
            relationList.year.push({
                name: monthJiObj.haeName,
                isClose: true,
                columnName: '년_월',
            });
            relationList.month.push({
                name: monthJiObj.haeName,
                isClose: true,
                columnName: '년_월',
            });
        }

        //월간과 시간 해
        else if (timeJi && monthJiObj.hae === timeJi) {
            relationList.month.push({
                name: monthJiObj.haeName,
                isClose: false,
                columnName: '월_시',
            });

            relationList.time?.push({
                name: monthJiObj.haeName,
                isClose: false,
                columnName: '월_시',
            });
        }

        //연간과 시간이 해
        else if (timeJi && yearJiObj.hae === timeJi) {
            relationList.year.push({
                name: yearJiObj.haeName,
                isClose: false,
                columnName: '년_시',
            });
            relationList.time?.push({
                name: yearJiObj.haeName,
                isClose: false,
                columnName: '년_시',
            });
        }
    }

    return relationList;
};

const checkJijiPaRelation = (
    yearJi: JijiType,
    monthJi: JijiType,
    dayJi: JijiType,
    timeJi: JijiType | null,
) => {
    const yearJiObj = jijiRelation[yearJi];
    const monthJiObj = jijiRelation[monthJi];
    const dayJiObj = jijiRelation[dayJi];

    const relationList: BirthColumnGroup<Relation[]> = {
        year: [],
        month: [],
        day: [],
        time: [],
    };

    /** 파(중복 안됨) */
    //일간과 월간이 파
    if (dayJiObj.pa === monthJi) {
        relationList.month.push({ name: dayJiObj.paName, isClose: true, columnName: '월_일' });
        relationList.day.push({ name: dayJiObj.paName, isClose: true, columnName: '월_일' });

        //연간과 시간이 파
        if (timeJi && yearJiObj.pa === timeJi) {
            relationList.year.push({
                name: yearJiObj.paName,
                isClose: false,
                columnName: '년_시',
            });
            relationList.time?.push({
                name: yearJiObj.paName,
                isClose: false,
                columnName: '년_시',
            });
        }
    }

    //일간과 시간 파
    else if (timeJi && dayJiObj.pa === timeJi) {
        relationList.day.push({ name: dayJiObj.paName, isClose: true, columnName: '일_시' });
        relationList.time?.push({
            name: dayJiObj.paName,
            isClose: true,
            columnName: '일_시',
        });

        //연간과 월간 파
        if (yearJiObj.pa === monthJi) {
            relationList.year.push({
                name: yearJiObj.paName,
                isClose: true,
                columnName: '년_월',
            });
            relationList.month.push({
                name: yearJiObj.paName,
                isClose: true,
                columnName: '년_월',
            });
        }
    }

    //일간과 연간 파
    else if (dayJiObj.pa === yearJi) {
        relationList.day.push({ name: dayJiObj.paName, isClose: false, columnName: '년_일' });
        relationList.year.push({
            name: dayJiObj.paName,
            isClose: false,
            columnName: '년_일',
        });

        //월간과 시간 파
        if (timeJi && monthJiObj.pa === timeJi) {
            relationList.month.push({
                name: monthJiObj.paName,
                isClose: false,
                columnName: '월_시',
            });

            relationList.time?.push({
                name: monthJiObj.paName,
                isClose: false,
                columnName: '월_시',
            });
        }
    } else {
        //월간과 연간 파
        if (monthJiObj.pa === yearJi) {
            relationList.year.push({
                name: monthJiObj.paName,
                isClose: true,
                columnName: '년_월',
            });
            relationList.month.push({
                name: monthJiObj.paName,
                isClose: true,
                columnName: '년_월',
            });
        }

        //월간과 시간 파
        else if (timeJi && monthJiObj.pa === timeJi) {
            relationList.month.push({
                name: monthJiObj.paName,
                isClose: false,
                columnName: '월_시',
            });

            relationList.time?.push({
                name: monthJiObj.paName,
                isClose: false,
                columnName: '월_시',
            });
        }

        //연간과 시간이 파
        else if (timeJi && yearJiObj.pa === timeJi) {
            relationList.year.push({
                name: yearJiObj.paName,
                isClose: false,
                columnName: '년_시',
            });
            relationList.time?.push({
                name: yearJiObj.paName,
                isClose: false,
                columnName: '년_시',
            });
        }
    }

    return relationList;
};

const hasSamhapOrhyung = (samList: string[], targets: string[]) => {
    //samList가 비어있는가
    if (samList.length === 0) return false;

    const uniqueTargets = new Set(targets);

    return uniqueTargets.size >= 3 && samList.every((item) => uniqueTargets.has(item));
};

const hasBanhapOrHyung = (
    samList: string[],
    wangji: string | null,
    first: string,
    second: string,
) => {
    //samList가 비어있는가
    if (samList.length === 0) return false;

    // 중복 지지 제거
    if (first === second) return false;

    // 둘 다 삼합 구성원인가
    if (!samList.includes(first) || !samList.includes(second)) {
        return false;
    }

    // 둘 중 하나가 왕지인가
    return wangji && (first === wangji || second === wangji);
};
