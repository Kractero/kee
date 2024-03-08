export const emptyClause = (qualifier: string) => {
  return {
    qualifier: qualifier,
    whereValue: '',
    conditionValue: 'IS',
    badgeTrophyValue: '',
    input: '',
    trophyPercentage: ''
  }
}