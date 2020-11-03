import {
  CHS_EMPTY as EMY,
  CHS_CANNON as CN,
  CHS_CASTLE as CE,
  CHS_GENERAL as GL,
  CHS_HORSE as HE,
  CHS_JUMBO as JO,
  CHS_KNIGHT as KT,
  CHS_SOLDIER as SR,
} from "./constants";

const getInitialBoard = () => {
  const [CNU, CNL] = [CN.toUpperCase(), CN.toLowerCase()];
  const [CEU, CEL] = [CE.toUpperCase(), CE.toLowerCase()];
  const [GLU, GLL] = [GL.toUpperCase(), GL.toLowerCase()];
  const [HEU, HEL] = [HE.toUpperCase(), HE.toLowerCase()];
  const [JOU, JOL] = [JO.toUpperCase(), JO.toLowerCase()];
  const [KTU, KTL] = [KT.toUpperCase(), KT.toLowerCase()];
  const [SRU, SRL] = [SR.toUpperCase(), SR.toLowerCase()];
  return [
    [CEU, HEU, JOU, KTU, GLU, KTU, JOU, HEU, CEU],
    [EMY, EMY, EMY, EMY, EMY, EMY, EMY, EMY, EMY],
    [EMY, CNU, EMY, EMY, EMY, EMY, EMY, CNU, EMY],
    [SRU, EMY, SRU, EMY, SRU, EMY, SRU, EMY, SRU],
    [EMY, EMY, EMY, EMY, EMY, EMY, EMY, EMY, EMY],

    [EMY, EMY, EMY, EMY, EMY, EMY, EMY, EMY, EMY],
    [SRL, EMY, SRL, EMY, SRL, EMY, SRL, EMY, SRL],
    [EMY, CNL, EMY, EMY, EMY, EMY, EMY, CNL, EMY],
    [EMY, EMY, EMY, EMY, EMY, EMY, EMY, EMY, EMY],
    [CEL, HEL, JOL, KTL, GLL, KTL, JOL, HEL, CEL],
  ];
};

export default getInitialBoard;
