const Test = require("../model/test");
const mongoose = require("mongoose");


const { Question, Answer } = require("../model/question");

const mockIds = [
  {
    title: "Mock 7", Question:
      [
        "663fdcfaeb80ae527cca97a4",
        "663fdd04e3760e5c8b4d6d61",
        "663fdd0ae3760e5c8b4d6d64",
        "663fdadcea926d0cf576e014",
        "663fdae1ea926d0cf576e017",
        "663fdae6ea926d0cf576e01a",
        "663fdaebea926d0cf576e01d",
        "663fdaf1ea926d0cf576e020",
        "663fdaf5ea926d0cf576e023",
        "663fdaf5ea926d0cf576e023",
        "663fdaf5ea926d0cf576e023",
        "663fdb040c5f3ba35566972e",
        "663fdb090c5f3ba355669731",
        "663fdb0e0c5f3ba355669734",
        "663fdb120c5f3ba355669737",
        "663fdd53e3760e5c8b4d6d67",
        "66420956e857ee23e08036bd",
        "663fd215d37fd284bf0155b4",
        "663fd21bd37fd284bf0155bb",
        "663fd21fd37fd284bf0155c2",
        "663fd225d37fd284bf0155c9",
        "663fd22ad37fd284bf0155d0",
        "663fd22fd37fd284bf0155d7",
        "663fd234d37fd284bf0155de",
        "663fd239d37fd284bf0155e5",
        "663fd23ed37fd284bf0155ec",
        "663fd244d37fd284bf0155f3",
        "663fd248d37fd284bf0155fa",
        "663fd24dd37fd284bf015601",
        "663fd253d37fd284bf015608",
        "663fd258d37fd284bf01560f",
        "663fd25ed37fd284bf015616",
        "663fd263d37fd284bf01561d",
        "663fd269d37fd284bf015624",
        "663fd269d37fd284bf015624",
        "663fd274d37fd284bf01562b",
        "663fd279d37fd284bf015632",
        "663fd27ed37fd284bf015639",
        "663fd284d37fd284bf015640",
        "663fd284d37fd284bf015640",
        "663fd28fd37fd284bf015647",
        "663fd295d37fd284bf01564e",
        "663fd299d37fd284bf015655",
        "663fd2a0d37fd284bf01565c",
        "663fd2a6d37fd284bf015663",
        "661d3e99cdc8f078f5791ced",
        "661d3ea1cdc8f078f5791cf4",
        "661d3eaacdc8f078f5791cfb",
        "661d3eb3cdc8f078f5791d02",
        "661d3ebbcdc8f078f5791d09",
        "661d3ec3cdc8f078f5791d10",
        "661d3ecdcdc8f078f5791d17",
        "661d3ed6cdc8f078f5791d1e",
        "661d3edecdc8f078f5791d25",
        "661d3ee7cdc8f078f5791d2c",
        "661d3ef0cdc8f078f5791d33",
        "661d3ef9cdc8f078f5791d3a",
        "661d3efecdc8f078f5791d41",
        "661d3f03cdc8f078f5791d48",
        "661d3f08cdc8f078f5791d4f",
        "661d3f0dcdc8f078f5791d56",
        "661d3f12cdc8f078f5791d5d",
        "661d3f17cdc8f078f5791d64",
        "661d3f1ccdc8f078f5791d6b",
        "661d3f22cdc8f078f5791d72",
        "661d3f28cdc8f078f5791d79",
        "661d3f2ecdc8f078f5791d80",
        "661d3f34cdc8f078f5791d87",
        "661d3f3acdc8f078f5791d8e",
        "661d3f40cdc8f078f5791d95",
        "661d3f46cdc8f078f5791d9c",
        "661d3f4ccdc8f078f5791da3",
        "661d3f52cdc8f078f5791daa",
        "661d3f58cdc8f078f5791db1",
        "661d3f5dcdc8f078f5791db8",
        "661d3f63cdc8f078f5791dbf",
        "661d3f68cdc8f078f5791dc6",
        "661d3f6dcdc8f078f5791dcd",
        "661d3f73cdc8f078f5791dd4",
        "661d3f78cdc8f078f5791ddb",
        "661d3f7dcdc8f078f5791de2",
        "661d3f83cdc8f078f5791de9",
        "661d3f88cdc8f078f5791df0",
        "661d3f8ccdc8f078f5791df7",
        "660fb2d24f02dbe128ff2972",
        "661d3f98cdc8f078f5791e05",
        "661d3f9dcdc8f078f5791e08",
        "661d3fa3cdc8f078f5791e0b",
        "661d3fa9cdc8f078f5791e0e",
        "661d40d0cdc8f078f5791e86"
      ]
  }
];

async function createTestOld() {
  for (let items of mockIds) {
    let questionIds = items.Question;
    let title = items.title;
    const testObj = {
      name: title,
      description: title,
      instructions: "Read the instructions carefully before answering.",
      sections: [
        {
          name: "QA SA",
          questions: questionIds.slice(0, 15).map((qid) => ({
            _id: new mongoose.Types.ObjectId(qid),
            positives: 4,
            negatives: 0,
          })),
          duration: 2400,
        },
        {
          name: "QA MCQ",
          questions: questionIds.slice(15, 45).map((qid) => ({
            _id: new mongoose.Types.ObjectId(qid),
            positives: 4,
            negatives: 1,
          })),
          duration: 2400,
        },
        {
          name: "VA MCQ",
          questions: questionIds.slice(45, 90).map((qid) => ({
            _id: new mongoose.Types.ObjectId(qid),
            positives: 4,
            negatives: 1,
          }
          )),
          duration: 2400,
        },
      ],
      duration: 7200,
    };
    console.log(JSON.stringify(testObj))
    // await Test.create(testObj);
    // console.log(title + " Uploaded")
  }
}

const vaIds = [
  "",
  "",
  "664479e9c5726369e740df5e",
  "664479f1c5726369e740df65",
  "664479f7c5726369e740df6c",
  "664479fec5726369e740df73",
  "66447a06c5726369e740df7a",
  "66447a0dc5726369e740df81",
  "66447a14c5726369e740df88",
  "66447a1cc5726369e740df8f",
  "66447a24c5726369e740df96",
  "66447a2bc5726369e740df9d",
  "66447a31c5726369e740dfa4",
  "66447a35c5726369e740dfab",
  "66447a3bc5726369e740dfb2",
  "66447a3fc5726369e740dfb9",
  "66447a45c5726369e740dfc0",
  "66447a49c5726369e740dfc7",
  "66447a4fc5726369e740dfce",
  "66447a55c5726369e740dfd5",
  "66447a5bc5726369e740dfdc",
  "66447a60c5726369e740dfe3",
  "66447a66c5726369e740dfea",
  "66447a6cc5726369e740dff1",
  "66447a71c5726369e740dff8",
  "66447a77c5726369e740dfff",
  "66447a7cc5726369e740e006",
  "66447a82c5726369e740e00d",
  "66447a87c5726369e740e014",
  "66447a8cc5726369e740e01b",
  "66447a92c5726369e740e022",
  "66447a96c5726369e740e029",
  "66447a9cc5726369e740e030",
  "66447aa1c5726369e740e037",
  "66447aa6c5726369e740e03e",
  "66447aacc5726369e740e045",
  "66447ab1c5726369e740e04c",
  "66447ab6c5726369e740e053",
  "66447abbc5726369e740e05a",
  "66447ac0c5726369e740e061",
  "66447ac5c5726369e740e068",
  "66447acac5726369e740e06b",
  "66447acfc5726369e740e06e",
  "66447ad4c5726369e740e071",
  "66447ad9c5726369e740e074"
];

async function createVa() {
  const testObj = {
    name: "Verbal Sectional Mock 15",
    description: "Verbal Sectional Mock 15",
    instructions: "Read the instructions carefully before answering.",
    sections: [
      {
        name: "VA",
        questions: vaIds.map((qid) => ({
          _id: new mongoose.Types.ObjectId(qid),
          positives: 4,
          negatives: 1,
        })),
        duration: 2400,
      }
    ],
    duration: 2400,
  };
  console.log(JSON.stringify(testObj))
  let test = await Test.create(testObj);
  return test;
}

async function deleteDocumentById(idToDelete) {
  try {
    const result = await Question.findByIdAndDelete(idToDelete);
    console.log('Document deleted successfully:', result);
  } catch (error) {
    console.error('Error deleting document:', error);
  }
}

async function checkAnswers() {
  // console.log(await Question.findOne({_id: "66048be7691c910136bb453d"}))
  // console.log(await Answer.create({
  //   _id: "66048be7691c910136bb453d",
  //   answer: "66048be7691c910136bb4541",
  //   solution: "https://res.cloudinary.com/dnxhyhnvn/image/upload/v1711325815/Permutation%20and%20Combination%20and%20Probability/PCP_Q19_mfgbhm.png",
  // }))
  // for (const items of vaIds) {
  for (const item of vaIds) {
    let ansObj = (await Answer.findOne({ _id: item }));
    if (ansObj == null) {
      console.log(item, "->", "answer does not exist for this item")
      // await deleteDocumentById(item);
      continue;
    }
    console.log(item, "->", ansObj.answer)
  }
  // }
}

async function checkTags() {
  for (const item of ids) {
    let QuestionObj = (await Question.findOne({ _id: item }));
    if (QuestionObj == null) {
      console.log(item, "->", "Question does not exist")
      continue;
    }
    console.log(item, "->", QuestionObj.meta.topic)
  }
}

const answerIds = [
  "6603d87fd11521729601e4c8",
  "6603d91cd11521729601e4d6",
  "660429716b1edebf01c811b6",
  "660468f7e3d1819abe60f118",
  "660468fbbc83701966a0515f",
  "66046942bc83701966a05164",
  "66046946bc83701966a0516b",
  "66046955bc83701966a05172",
  "6604695dbc83701966a05179",
  "6604697abc83701966a05180",
  "660469d8bc83701966a05183",
  "66046a67bc83701966a0519e",
  "66046b16bc83701966a051a5",
  "66046c8cbc83701966a051b3",
  "66046ca5bc83701966a051b6",
  "66046cebbc83701966a051bd",
  "66046d3fbc83701966a051c0",
  "66046d7dbc83701966a051c7",
  "66046df0bc83701966a051ca",
  "66046e0fbc83701966a051d1",
  "66046e69bc83701966a051d4",
  "66046ee0bc83701966a051db",
  "66046eeebc83701966a051e2",
  "66046f98bc83701966a051e5",
  "66046f9fbc83701966a051e8",
  "66047036bc83701966a051f7",
  "66047040bc83701966a051fe",
  "660470d7bc83701966a05201",
  "660470f1bc83701966a05208",
  "6604719dbc83701966a0520b",
  "660471babc83701966a0520e",
  "6604722ebc83701966a05215",
  "6604726fbc83701966a05218",
  "66047298bc83701966a0521f",
  "660472cebc83701966a05222",
  "660472fbbc83701966a05225",
  "6604732fbc83701966a0522c",
  "66047395bc83701966a0522f",
  "66047c38e3dc09d3365da701",
  "66047c57e3dc09d3365da708",
  "66047cb7e3dc09d3365da70f",
  "66047ccae3dc09d3365da716",
  "66047d24e3dc09d3365da71d",
  "66047d5ce3dc09d3365da724",
  "66047d81e3dc09d3365da72b",
  "66047dc5e3dc09d3365da732",
  "66047dd6e3dc09d3365da739",
  "66047e18e3dc09d3365da740",
  "66047e39e3dc09d3365da747",
  "66047e93e3dc09d3365da74e",
  "66047ee8e3dc09d3365da755",
  "66047f36e3dc09d3365da75c",
  "66047f97e3dc09d3365da763",
  "66048028e3dc09d3365da76a",
  "66048183834bb75f0886054f",
  "660481876a1b3dc7f922e937",
  "6604818f6a1b3dc7f922e940",
  "6604819c6a1b3dc7f922e947",
  "660481a56a1b3dc7f922e94e",
  "660482fe6a1b3dc7f922e955",
  "660483076a1b3dc7f922e95c",
  "6604830e6a1b3dc7f922e963",
  "660483386a1b3dc7f922e974",
  "6604834d6a1b3dc7f922e97b",
  "660483576a1b3dc7f922e982",
  "660483636a1b3dc7f922e989",
  "6604836e6a1b3dc7f922e990",
  "6604837a6a1b3dc7f922e997",
  "660485a92297bfba3a33f634",
  "660485ab2297bfba3a33f63d",
  "660485ac2297bfba3a33f644",
  "660485ef2297bfba3a33f64b",
  "660485fc2297bfba3a33f652",
  "660486062297bfba3a33f659",
  "6604860f2297bfba3a33f660",
  "660486172297bfba3a33f667",
  "6604861f2297bfba3a33f66e",
  "660486ef2297bfba3a33f675",
  "66048710ec5e8c3729264cda",
  "66048846691c910136bb4522",
  "66048849c571ff467365debe",
  "660488abc571ff467365dec7",
  "66048901c571ff467365dece",
  "660489a9c571ff467365ded5",
  "660489cdc571ff467365dedc",
  "660489e1c571ff467365dee8",
  "660489f0c571ff467365deef",
  "660489fdc571ff467365def6",
  "66048a08c571ff467365defd",
  "66048a14c571ff467365df04",
  "66048a21c571ff467365df0b",
  "66048a55c571ff467365df12",
  "66048aabc571ff467365df19",
  "66048aab691c910136bb452b",
  "66048abf691c910136bb452e",
  "66048b93691c910136bb4536",
  "66048c45691c910136bb4543",
  "66048cab691c910136bb454a",
  "66048cb7691c910136bb454d",
  "66048cbf691c910136bb4550",
  "66048cc0691c910136bb4553",
  "66048cca691c910136bb455a",
  "66048cd2691c910136bb455d",
  "66048dab691c910136bb4560",
  "660596ee44f4eb0feec7ad40",
  "6605984044f4eb0feec7ad4b",
  "6605a9d87bcdeffaf95937d4",
  "6605aab97bcdeffaf95937db",
  "66048be7691c910136bb453d",
  "6606440bfc87952b328225fe",
  "660648519cb28d7674959d7d",
  "66064856db73bd0435c440b8",
  "660812d7e369c1de3d024b6f",
  "6608149e8a16d3c5f633779e",
  "660815838a16d3c5f63377a5",
  "66081751cc2848fae3f29eaa",
  "66082376898f40deea3a8cc5",
  "660823fd898f40deea3a8ccc",
  "66087655b3cf0f77b6ebbdf8",
  "66087662b3cf0f77b6ebbe01",
  "66087698b3cf0f77b6ebbe08",
  "66087b3cd94a4104b16702a1",
  "66087cf03db39dc230d30695",
  "66087da289569e1acb9ea6ff",
  "66087e6989569e1acb9ea706",
  "66087f7e89569e1acb9ea70d",
  "6608805d89569e1acb9ea71a",
  "660880ce89569e1acb9ea721",
  "660881c689569e1acb9ea728",
  "6608821689569e1acb9ea72f",
  "6608827c89569e1acb9ea738",
  "6608827f89569e1acb9ea73f",
  "6608836989569e1acb9ea746",
  "660883b789569e1acb9ea74d",
  "6608849d89569e1acb9ea754",
  "660884ad89569e1acb9ea75b",
  "660885f9aa331162be47d895",
  "660886bf1a476941f6b622c7",
  "66088b845e229368f699b4dc",
  "66088dbd4b82eaf8df1698a6",
  "66088dc1c75fdca65ce7de9d",
  "66088e26c75fdca65ce7dea6",
  "6608906fc75fdca65ce7deb9",
  "660890dfc75fdca65ce7dec0",
  "6608924ac75fdca65ce7decd",
  "660892a3c75fdca65ce7ded4",
  "660892acc75fdca65ce7dedb",
  "66089385c75fdca65ce7dee2",
  "660893dcc75fdca65ce7dee9",
  "6608989cd2280ed11c678ec6",
  "66091e16043c5fb887405cc8",
  "66091e8e043c5fb887405ccf",
  "66091f1b043c5fb887405cd6",
  "66091fac043c5fb887405cdd",
  "6609217c468ffce839883baf",
  "6609218283d1fb8f5cc5aa0a",
  "6609220e83d1fb8f5cc5aa28",
  "660922f3468ffce839883bb8",
  "660923f20b0a86ff71d1761b",
  "660924720b0a86ff71d17622",
  "6609253a0b0a86ff71d17629",
  "660925b43b1ab7316285807f",
  "660926543b1ab73162858088",
  "6609275a3b1ab7316285808f",
  "6609a51ecf92c23809e3b959",
  "6609a551cf92c23809e3b960",
  "6609a55bcf92c23809e3b967",
  "6609a5a7cf92c23809e3b96e",
  "6609a5f0cf92c23809e3b975",
  "6609a64ecf92c23809e3b97c",
  "6609a6abcf92c23809e3b983",
  "6609a6cacf92c23809e3b98e",
  "6609a727cf92c23809e3b995",
  "6609a790cf92c23809e3b99c",
  "6609a811cf92c23809e3b9a4",
  "6609a81ccf92c23809e3b9ab",
  "6609a8e4cf92c23809e3b9b2",
  "6609a9aecf92c23809e3b9b9",
  "6609aa19cf92c23809e3b9c0",
  "6609aa8fcf92c23809e3b9c7",
  "6609aae6cf92c23809e3b9ce",
  "6609ace9cf92c23809e3bb57",
  "6609ace911fbb64735eb7403",
  "6609ad4a11fbb64735eb7593",
  "6609b6d990f43d07c1f08723",
  "6609bbcf6f948ee9fa1947d0",
  "6609bfb98f85dd6e73822aeb",
  "6609bfbc8f85dd6e73822af4",
  "6609bfbc8f85dd6e73822afb",
  "6609bfbf157711b6bf94ee11",
  "6609bfdc157711b6bf94ee1a",
  "6609c043157711b6bf94ee1d",
  "6609c04a157711b6bf94ee24",
  "6609c06f157711b6bf94ee31",
  "6609c095157711b6bf94ee34",
  "6609c0a2157711b6bf94ee37",
  "6609c0c9157711b6bf94ee44",
  "6609c12e157711b6bf94ee5f",
  "6609c2118f85dd6e73822b0e",
  "6609c2b08f85dd6e73822b21",
  "6609c2b68f85dd6e73822b28",
  "6609c2b98f85dd6e73822b2f",
  "6609c705a055f35e0cdff6a0",
  "6609ca01a055f35e0cdff6cd",
  "6609caa8a055f35e0cdff6ee",
  "6609cae47df625a986c09624",
  "6609cd87ea56293d10faf8d7",
  "6609cdecea56293d10faf8e0",
  "6609d08a47c6061f177565cb",
  "6609d08e8489d45c161018e4",
  "6609d0bc8489d45c161018ed",
  "6609d0c08489d45c161018f4",
  "6609d1688489d45c161018fb",
  "6609d1ae8489d45c16101905",
  "6609d1b18489d45c1610190c",
  "6609d1f28489d45c16101913",
  "6609de9622ed158f78becb4c"
];


async function checkQuestions() {
  for (const item of answerIds) {
    let QuestionObj = (await Question.findOne({ _id: item }));
    if (QuestionObj == null) {
      console.log(item, "->", "Question does not exist for this answer")
      continue;
    }
  }
}

module.exports = { createTestOld, checkAnswers, checkQuestions, createVa }

