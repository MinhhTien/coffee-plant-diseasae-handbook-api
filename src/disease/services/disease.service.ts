import { PaginationParams } from '@common/decorators/pagination.decorator'
import { DISEASE_LIST_PROJECTION } from '@disease/contracts/constant'
import { QueryDiseaseDto } from '@disease/dto/view-disease.dto'
import { Injectable, Inject } from '@nestjs/common'
import { IDiseaseRepository } from '@src/disease/repositories/disease.repository'
import { Disease, DiseaseDocument } from '@src/disease/schemas/disease.schema'
import { Aggregate, FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'

export const IDiseaseService = Symbol('IDiseaseService')

export interface IDiseaseService {
  create(disease: any, options?: SaveOptions | undefined): Promise<DiseaseDocument>
  findById(diseaseId: string, projection?: string | Record<string, any>): Promise<DiseaseDocument>
  update(
    conditions: FilterQuery<Disease>,
    payload: UpdateQuery<Disease>,
    options?: QueryOptions | undefined
  ): Promise<DiseaseDocument>
  list(pagination: PaginationParams, queryDiseaseDto: QueryDiseaseDto)
  findMany(
    conditions: FilterQuery<DiseaseDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<DiseaseDocument[]>
  countDisease(conditions: FilterQuery<DiseaseDocument>): Promise<number>
  countSymptom(conditions: FilterQuery<DiseaseDocument>): Promise<number>
  countPrevention(conditions: FilterQuery<DiseaseDocument>): Promise<number>
  getSymptomReportByLevel(): Aggregate<any[]>
  getDiseaseReportByMonth(): Aggregate<any[]>
}

@Injectable()
export class DiseaseService implements IDiseaseService {
  constructor(
    @Inject(IDiseaseRepository)
    private readonly diseaseRepository: IDiseaseRepository
  ) {}

  // async onModuleInit() {
  //   await this.diseaseRepository.model.insertMany([
  //     {
  //       name: 'Bệnh tảo đỏ',
  //       reason: 'Vi khuẩn Pseudomonas và nấm Colletotrichum',
  //       description:
  //         'Bệnh táo đỏ cà phê là bệnh do vi khuẩn và nấm gây ra, đặc trưng của bệnh là xuất hiện các vết đỏ, loang màu và tụ điểm màu đỏ trên lá và quả của cây cà phê. Đây là một bệnh hại rất nguy hiểm gây suy yếu cây cà phê, ảnh hưởng đến chất lượng và năng suất của cây.',
  //       effectedVarieties: [
  //         new Types.ObjectId('676aca6f94501af32c8a3c6e'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c6f'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c70')
  //       ],
  //       symptoms: [
  //         {
  //           name: 'Chùm, lá, quả trở nên khô héo',
  //           level: SymptomLevel.LOW
  //         },
  //         {
  //           name: 'Lá và quả bao phủ một lớp phấn hồng bám chặt',
  //           level: SymptomLevel.MEDIUM
  //         },
  //         {
  //           name: 'Tổn thương trên bề mặt lá',
  //           level: SymptomLevel.HIGH
  //         },
  //         {
  //           name: 'Lá cây có thể bị rụng sớm',
  //           level: SymptomLevel.HIGH
  //         }
  //       ],
  //       preventions: [
  //         {
  //           name: 'Sử dụng thuốc bảo vệ thực vật',
  //           type: PreventionType.CHEMISTRY,
  //           effective: 5,
  //           instruction:
  //             'Lựa chọn thuốc phù hợp: Tùy theo loại vi khuẩn hoặc nấm gây bệnh, chọn các loại thuốc trừ bệnh có tác động hiệu quả và không gây hại cho môi trường và con người.',
  //           note: 'Tuân thủ hướng dẫn sử dụng và liều lượng được đề xuất trên nhãn sản phẩm để tránh tác động phụ không mong muốn và đảm bảo hiệu quả khắc phục bệnh.'
  //         },
  //         {
  //           name: 'Sử dụng biện pháp sinh học và công nghệ',
  //           type: PreventionType.BIOLOGY,
  //           effective: 5,
  //           instruction: 'Sử dụng máy đo nông đọ đất ẩm.',
  //           note: ''
  //         },
  //         {
  //           name: 'Cắt và bảo vệ cây xanh',
  //           type: PreventionType.PHYSICS,
  //           effective: 3,
  //           instruction: 'Cắt tỉa các cành bệnh , giữ lại các cạnh còn xanh tốt.',
  //           note: ''
  //         },
  //         {
  //           name: 'Giám sát và kiểm tra thường xuyên',
  //           type: PreventionType.PHYSICS,
  //           effective: 3,
  //           instruction:
  //             'Kiểm tra thường xuyên đặc biệt là vào mùa mưa khi môi trường ẩm ướt dễ dàng cho nấm sinh trưởng.',
  //           note: ''
  //         }
  //       ],
  //       time: {
  //         startTime: new Date('2023-04-01'),
  //         endTime: new Date('2023-06-31'),
  //         season: SeasonType.SUMMER
  //       },
  //       image:
  //         'https://res.cloudinary.com/dbimwvmcy/image/upload/v1735096178/coffee-plant-handbook/uctapjpj63wtbc852n2n.png'
  //     },
  //     {
  //       name: 'Bệnh gỉ sắt',
  //       reason: 'Do nấm Hemileia vastatrix dòng B và nấm Hemileia vastatrix dòng Br.',
  //       description:
  //         'Bệnh rỉ sắt trên cây cà phê là một trong những “nỗi lo” thường trực của bà con nông dân trồng cà phê,  thường xuất hiện vào tháng 4 – 5 tại Tây Nguyên và tháng 9 – 10 ở các tỉnh miền Bắc. Lá cây bị bệnh rỉ sắt sẽ vàng úa và rụng dần, ảnh hưởng nặng nề đến quá trình tăng trưởng tiếp theo của cây là ra hoa, kết trái. Bởi cây mắc bệnh sẽ rụng lá nhiều, suy kiệt, kém phát triển, không còn khả năng đậu quả. Từ đó, ảnh hưởng nặng nề đến năng suất thu hoạch của cây cà phê.',
  //       effectedVarieties: [
  //         new Types.ObjectId('676aca6f94501af32c8a3c6e'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c6f'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c70')
  //       ],
  //       symptoms: [
  //         {
  //           name: 'Mặt dưới của lá cây cà phê xuất hiện những đốm tròn nhỏ màu vàng nhạt',
  //           level: SymptomLevel.LOW
  //         },
  //         {
  //           name: 'Bề mặt những đốm vàng xuất hiện một lớp bột phấn màu vàng cam hoặc da cam.',
  //           level: SymptomLevel.MEDIUM
  //         },
  //         {
  //           name: 'Lá cây biến thành màu vàng, sau đó sẽ héo và rụng dần.',
  //           level: SymptomLevel.HIGH
  //         }
  //       ],
  //       preventions: [
  //         {
  //           name: 'Áp dụng đúng phương pháp canh tác',
  //           type: PreventionType.PHYSICS,
  //           effective: 5,
  //           instruction:
  //             '- Nên trồng cà phê ở đồi cao thoáng, với mật độ vừa phải.\n' +
  //             '- Trong mùa mưa, thường xuyên vệ sinh vườn cây, trừ cỏ dại và cắt tỉa cành chết, để phòng tránh bệnh dịch có thể lây lan từ cây này sang cây khác khi xuất hiện.\n' +
  //             '- Cũng nên chọn những giống cây cà phê có khả năng kháng bệnh rỉ sắt tốt. Có thể là những giống cà phê sau: Cà phê xanh lùn, cà phê vối TR9, cà phê vối TR4.\n' +
  //             '- Bón đầy đủ và cân đối giữa phân bón vô cơ và phân bón hữu cơ cho cây cà phê, có kế hoạch tỉa cành hợp lý để cây có thể phát triển tốt.\n' +
  //             '- Đặc biệt, để phòng tránh bệnh rỉ sắt trên cây cà phê một cách tốt nhất bà con nên chăm sóc vườn cà phê cẩn thận, để cây tự có khả năng kháng bệnh mà không cần sự hỗ trợ của các loại thuốc trừ sâu.',
  //           note: 'Đảm bảo an toàn khi thực hiện.'
  //         },
  //         {
  //           name: 'Sử dụng thuốc hóa học',
  //           type: PreventionType.CHEMISTRY,
  //           effective: 3,
  //           instruction:
  //             '- Khi bắt đầu có dấu hiệu bị bệnh, thường vào tháng 6,7 - thực hiện phun thuốc hóa học trừ sâu bệnh 2 - 3 lần, mỗi lần cách nhau 7 - 10 ngày.\n' +
  //             '- Vào đầu mùa mưa phun phòng trừ để tăng sức đề kháng cho cây.',
  //           note:
  //             'Thuốc trị bệnh rỉ sắt trên cây cà phê khi bắt đầu có dấu hiệu bị bệnh: Iben-C 50BTN, Tilt Super 300 EC, Anvil 5SC, Dizeb-Mb45 80 WP,...\n' +
  //             'Thuốc phòng trừ bệnh rỉ sét cho cây cà phê vào đầu mùa mưa: Dung dịch Booc- đô hoặc các thuốc gốc đồng như Coc 85, Funguran, Champion hoặc đồng đỏ…'
  //         }
  //       ],
  //       time: {
  //         startTime: new Date('2023-03-01'),
  //         endTime: new Date('2023-07-31'),
  //         season: SeasonType.SUMMER
  //       },
  //       image:
  //         'https://res.cloudinary.com/dbimwvmcy/image/upload/v1735106535/coffee-plant-handbook/vaixbzjgoqipy0z7u6hn.png'
  //     },
  //     {
  //       name: 'Bệnh thối rễ tơ',
  //       reason: 'Do tuyến trùng Pratylenchus – Meloidogyne spp và nấm ký sinh Fusarium solani gây ra.',
  //       description:
  //         'Bệnh thối rễ tơ cà phê là loại bệnh nguy hiểm khó phòng trị. Bệnh nặng dẫn đến cây cà phê héo khô, lá rụng dần và có thể chết cây. Mỗi năm có hàng trăm hecta cà phê bị nhiễm bệnh thối rễ gây thiệt hại lớn về kinh tế.',
  //       effectedVarieties: [new Types.ObjectId('676aca6f94501af32c8a3c6e')],
  //       symptoms: [
  //         {
  //           name: 'Sinh trưởng và phát triển kém: chùn đọt, cây thấp, ít cành lá, lá vàng, thối rễ cọc.',
  //           level: SymptomLevel.LOW
  //         },
  //         {
  //           name: 'Thường bị nghiêng trong mùa mưa và rất dễ nhổ lên bằng tay',
  //           level: SymptomLevel.MEDIUM
  //         },
  //         {
  //           name: 'Lá của cây chuyển sang màu vàng, rễ tơ bị thối.',
  //           level: SymptomLevel.HIGH
  //         }
  //       ],
  //       preventions: [
  //         {
  //           name: 'Sử dụng giống cà phê kháng bệnh hoặc giống khỏe mạnh.',
  //           type: PreventionType.BIOLOGY,
  //           effective: 4,
  //           instruction: 'Tìm và chọn lọc những giống cà phê có khả năng chống bệnh tốt',
  //           note: ''
  //         },
  //         {
  //           name: 'Trồng trên đất có độ thoát nước tốt, tránh ngập úng.',
  //           type: PreventionType.PHYSICS,
  //           effective: 5,
  //           instruction: '',
  //           note: ''
  //         },
  //         {
  //           name: 'Bổ sung phân hữu cơ hoai mục và các loại vi sinh vật đối kháng như Trichoderma để cải thiện đất.',
  //           type: PreventionType.BIOLOGY,
  //           effective: 3,
  //           instruction: '',
  //           note: ''
  //         }
  //       ],
  //       time: {
  //         startTime: new Date('2023-06-01'),
  //         endTime: new Date('2023-08-31'),
  //         season: SeasonType.FALL
  //       },
  //       image:
  //         'https://res.cloudinary.com/dbimwvmcy/image/upload/v1735106573/coffee-plant-handbook/j16r2gru6gr71ep7ontp.png'
  //     },
  //     {
  //       name: 'Bệnh nấm hồng',
  //       reason: 'Do loài nấm Corticium salmonicolor gây ra.',
  //       description:
  //         'Bệnh nấm hồng trên cây cà phê là loại bệnh phổ biến của giống cây này. Các bào từ nấm hồng sau khi bám chặt lên cây cà phê sẽ phát triển hệ thống vòi hút ăn sâu vào các bộ phận của cây, lấy hết các chất dinh dưỡng nuôi sống cây cà phê. Đồng thời, có thể làm hệ thống dẫn truyền chất dinh dưỡng của cây bị phá huỷ, cây không thể tiếp nhận được nước và phân bón, từ đó sẽ dần khô héo, vàng úa và chết.',
  //       effectedVarieties: [
  //         new Types.ObjectId('676aca6f94501af32c8a3c6e'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c6f')
  //       ],
  //       symptoms: [
  //         {
  //           name: 'Chùm, lá, quả trở nên khô héo',
  //           level: SymptomLevel.LOW
  //         },
  //         {
  //           name: 'Lá và quả bao phủ một lớp phấn hồng bám chặt',
  //           level: SymptomLevel.MEDIUM
  //         },
  //         {
  //           name: 'Những chùm quả cà phê và cành non, yếu ớt, sức đề kháng kém',
  //           level: SymptomLevel.HIGH
  //         }
  //       ],
  //       preventions: [
  //         {
  //           name: 'Trồng cây với mật độ phù hợp, vừa phải, cụ thể',
  //           type: PreventionType.PHYSICS,
  //           effective: 3,
  //           instruction: 'Trồng với khoảng cách 3 - 3,5m/ cây.',
  //           note: 'Tỉa cành ít nhất 2 lần/năm'
  //         },
  //         {
  //           name: 'tiêu diệt bằng các biện pháp hoá học có chứa các hoạt chất Hexaconazole, Validamycin, Albendazole… hoặc các thuốc chứa ion đồng, ion bạc...',
  //           type: PreventionType.CHEMISTRY,
  //           effective: 5,
  //           instruction:
  //             'Thực hiện biện pháp phun phòng bệnh, năm ít nhất 2 lần vào trước thời điểm bệnh thường bùng phát. Khi bệnh xuất hiện thì phun 2–3 lần cách nhau 7–10 ngày để tiêu diệt dứt điểm mầm bệnh.',
  //           note: 'Giảm tiếp xúc của con người với những loại hoá chất có hại, bảo vệ sức khoẻ bà con nông dân.'
  //         },
  //         {
  //           name: 'Sử dụng thêm cho cây cà phê một số loại phân bón có tác dụng tiêu trừ bệnh. Đây được xem là cách phòng bệnh hiệu quả nhất.',
  //           type: PreventionType.BIOLOGY,
  //           effective: 5,
  //           instruction: 'Thay các cây bị bệnh bằng các cây còn khỏe học bón phân phù hợp vơi loại cây',
  //           note: 'Bón phân vừa phải'
  //         }
  //       ],
  //       time: {
  //         startTime: new Date('2023-01-01'),
  //         endTime: new Date('2023-04-31'),
  //         season: SeasonType.SPRING
  //       },
  //       image:
  //         'https://res.cloudinary.com/dbimwvmcy/image/upload/v1735106600/coffee-plant-handbook/nfo2ggi1wvhpylyosnb2.png'
  //     },
  //     {
  //       name: 'Bệnh khô cành, khô quả',
  //       reason: 'Do một loài nấm có tên gọi Colletotrichum Cofeanum Noack gây ra.',
  //       description:
  //         'Bệnh khô cành khô quả trên cây cà phê xuất hiện nhiều trong mùa mưa khiến cho chất lượng và sản lượng cà phê bị sụt giảm. Bệnh gây rụng quả non giảm năng suất, cành khô héo nhiều gây khuyết tán, mất cành dự trữ, ảnh hưởng thêm năng suất vụ sau.',
  //       effectedVarieties: [
  //         new Types.ObjectId('676aca6f94501af32c8a3c6e'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c6f'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c70')
  //       ],
  //       symptoms: [
  //         {
  //           name: 'Những vết nhỏ màu vàng nâu hoặc nâu xuất hiện trên quả, cành, lá.',
  //           level: SymptomLevel.LOW
  //         },
  //         {
  //           name: 'Vết bệnh lõm xuống dần chuyển thành nâu sẫm, cành lá quả nhiễm bệnh bị khô héo rồi chuyển sang màu đen và gãy rụng.',
  //           level: SymptomLevel.HIGH
  //         }
  //       ],
  //       preventions: [
  //         {
  //           name: 'Bón phân cân đối, hợp lý cho cây.',
  //           type: PreventionType.BIOLOGY,
  //           effective: 4,
  //           instruction: 'Tìm và chọn lọc những giống cà phê có khả năng chống bệnh tốt',
  //           note: ''
  //         },
  //         {
  //           name: 'Trồng cây che bóng.',
  //           type: PreventionType.PHYSICS,
  //           effective: 3,
  //           instruction: '',
  //           note: ''
  //         },
  //         {
  //           name: 'Cắt, gom tiêu hủy những đoạn cành bị bệnh.',
  //           type: PreventionType.PHYSICS,
  //           effective: 4,
  //           instruction: '',
  //           note: ''
  //         }
  //       ],
  //       time: {
  //         startTime: new Date('2023-09-01'),
  //         endTime: new Date('2023-12-31'),
  //         season: SeasonType.WINTER
  //       },
  //       image:
  //         'https://res.cloudinary.com/dbimwvmcy/image/upload/v1735106626/coffee-plant-handbook/qmfufn63nj6ryopuepi7.png'
  //     },
  //     {
  //       name: 'Bệnh rệp sáp',
  //       reason: 'Do côn trùng rệp sáp (Planococcus spp. và Pseudococcus spp.) tấn công lên các bộ phận của cây.',
  //       description:
  //         'Bệnh rệp sáp hay còn gọi là bệnh phấn trắng, rệp sáp trắng. Bệnh thường xuất hiện khi cây cà phê nở hoa đến hết vụ thu hái. Tuy nhiên, sau khi thu hoạch rệp sáp vẫn còn sống và có thể đẻ trứng trong những cụm hoa chưa nở. Loài rệp này thường gây hại cây vào tất cả các mùa trong năm nhưng chúng thường tấn công mạnh vào mùa khô và đầu mùa mưa, đặc biệt là những cơn mưa đầu mùa. Khi trời mưa nhiều, độ ẩm không khí tăng cao thì mức độ tấn công của rệp sáp cũng giảm dần theo.',
  //       effectedVarieties: [
  //         new Types.ObjectId('676aca6f94501af32c8a3c6e'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c6f'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c70')
  //       ],
  //       symptoms: [
  //         {
  //           name: 'Cây cà phê suy yếu và trên cành xuất hiện những đốm trắng.',
  //           level: SymptomLevel.HIGH
  //         },
  //         {
  //           name: 'Lá cây bị mất màu và chuyển sang màu vàng hoặc nâu và dần héo úa.',
  //           level: SymptomLevel.LOW
  //         },
  //         {
  //           name: 'Mặt trên của lá cà phê xuất hiện nhiều mảng sáp màu trắng hoặc nâu.',
  //           level: SymptomLevel.LOW
  //         },
  //         {
  //           name: 'Trên lá sẽ xuất hiện những dấu vết màu nâu do rệp sáp ăn lá để lại.',
  //           level: SymptomLevel.MEDIUM
  //         }
  //       ],
  //       preventions: [
  //         {
  //           name: 'Áp dụng đúng biện pháp canh tác.',
  //           type: PreventionType.PHYSICS,
  //           effective: 5,
  //           instruction:
  //             '- Thường xuyên dọn dẹp vệ sinh vườn tược, dọn sạch cỏ quanh gốc để hạn chế quá trình lây lan của nấm và sinh vật gây bệnh\n' +
  //             '- Cắt tỉa cành để tạo độ thông thoáng cho vườn đồng thời cắt bỏ những cành bị bệnh nặng và tiêu hủy chứng để hạn chế sự phát triển của rệp sáp\n' +
  //             '- Chọn giống cà phê khỏe, cho năng suất cao và kháng sâu bệnh tốt ',
  //           note: 'Đảm bảo an toàn sức khoẻ khi thực hiện'
  //         },
  //         {
  //           name: 'Bón phân thường xuyên cho cây.',
  //           type: PreventionType.CHEMISTRY,
  //           effective: 3,
  //           instruction:
  //             'Chế độ bón phân cân đối hợp lý, trộn đều phân chuồng hoai và NPK với phân bón hữu cơ sinh học để giúp cây phát triển tốt và có sức chống lại rệp sáp.',
  //           note:
  //             '- Đảm bảo bón đúng phân và đúng liều lượng để cho cây có thể phát triển.\n' +
  //             '- Cân nhắc các loại phân bón như: Phân chuồng, phân NPK hoặc các loại phân bón hữu cơ sinh học.'
  //         },
  //         {
  //           name: 'Sử dụng thuốc hoá học phun cho cây.',
  //           type: PreventionType.PHYSICS,
  //           effective: 4,
  //           instruction:
  //             'Cần lựa chọn thuốc trừ sâu có thành phần chống rệp sáp trên cây cà phê. Có thể sử dụng các thuốc chứa gốc đồng để phun xịt cho cây vì đồng mát sẽ làm mòn lớp vỏ kitin của rệp sáp.',
  //           note:
  //             'Cần xác định thời điểm phun thuốc hợp lý. Cần phun thuốc trong giai đoạn rệp sáp còn non và chưa phát triển hoàn thiện để diệt trừ mầm bệnh hiệu quả.\n' +
  //             'Tham khảo các loại thuốc: Map Permethrin 50EC, Carbosan 25EC, Thiamax 25WG, ...'
  //         }
  //       ],
  //       time: {
  //         startTime: new Date('2023-10-01'),
  //         endTime: new Date('2023-12-31'),
  //         season: SeasonType.WINTER
  //       },
  //       image:
  //         'https://res.cloudinary.com/dbimwvmcy/image/upload/v1735106654/coffee-plant-handbook/obskpo3sql54euuxjcao.png'
  //     },
  //     {
  //       name: 'Mọt đục cành',
  //       reason: 'Do loài mọt đục cành gây nên.',
  //       description:
  //         'Các vảy bao hình tam giác ở các đốt của cành cà phê đen lại, một vài cặp lá ở gần lỗ đục tiến về phía đầu cành bị rụng;  Cành bị mọt đục có hiện tượng héo, trên cành chỉ còn vài cặp lá ở phía đầu cành; Cành chết khô.',
  //       effectedVarieties: [
  //         new Types.ObjectId('676aca6f94501af32c8a3c6e'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c6f'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c70')
  //       ],
  //       symptoms: [
  //         {
  //           name: 'Các vảy bao hình tam giác ở các đốt của cành cà phê đen lại, một vài cặp lá ở gần lỗ đục tiến về phía đầu cành bị rụng.',
  //           level: SymptomLevel.MEDIUM
  //         },
  //         {
  //           name: 'Cành bị mọt đục có hiện tượng héo, trên cành chỉ còn vài cặp lá ở phía đầu cành.',
  //           level: SymptomLevel.MEDIUM
  //         },
  //         {
  //           name: 'Cành chết khô.',
  //           level: SymptomLevel.HIGH
  //         }
  //       ],
  //       preventions: [
  //         {
  //           name: 'Sử dụng thuốc hoá học phun cho cây.',
  //           type: PreventionType.PHYSICS,
  //           effective: 5,
  //           instruction:
  //             'Nên phun phòng ít nhất 1 lần/năm bằng các thuốc trừ sâu có tính thấm sâu, lưu dẫn mạnh. Khi thấy có mọt xuất hiện nhiều phun thành 2-3 lần mỗi lần cách nhau 7-10 ngày.',
  //           note: 'Đảm bảo an toàn sức khoẻ khi thực hiện'
  //         },
  //         {
  //           name: 'Bón phân thường xuyên cho cây.',
  //           type: PreventionType.CHEMISTRY,
  //           effective: 3,
  //           instruction:
  //             'Chế độ bón phân cân đối hợp lý, trộn đều phân chuồng hoai và NPK với phân bón hữu cơ sinh học để giúp cây phát triển tốt và có sức chống lại rệp sáp.',
  //           note: 'Các biện pháp hóa học kể trên cũng có thể áp dụng để phòng trừ rệp sáp hại cà phê, ve sầu hại cà phê, sâu đục cành cà phê, các loại rầy...'
  //         }
  //       ],
  //       time: {
  //         startTime: new Date('2023-07-01'),
  //         endTime: new Date('2023-10-31'),
  //         season: SeasonType.FALL
  //       },
  //       image:
  //         'https://res.cloudinary.com/dbimwvmcy/image/upload/v1735106678/coffee-plant-handbook/sn9mhia37r7txsuldwc0.png'
  //     },
  //     {
  //       name: 'Bệnh lở cổ rễ',
  //       reason: 'Chủ yếu do hai loại nấm Rhizoctonia solani và Fusarium spp',
  //       description:
  //         'Bệnh lở cổ rễ cà phê là một trong những nguyên nhân hàng đầu dẫn đến giảm mạnh năng suất và chất lượng sản phẩm. Khi cây bị nhiễm bệnh, hệ thống rễ bị phá hủy, không thể cung cấp đủ nước và dinh dưỡng cho cây. Điều này làm cây yếu đi, lá vàng úa, quả cà phê nhỏ và chất lượng kém.',
  //       effectedVarieties: [
  //         new Types.ObjectId('676aca6f94501af32c8a3c6e'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c6f'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c70')
  //       ],
  //       symptoms: [
  //         {
  //           name: 'Vùng cổ rễ của cây bắt đầu xuất hiện các vết thâm, thối mềm và dần dần chuyển sang màu nâu đen.',
  //           level: SymptomLevel.LOW
  //         },
  //         {
  //           name: 'Cây sẽ bị héo và vàng lá, đặc biệt là các lá non',
  //           level: SymptomLevel.MEDIUM
  //         },
  //         {
  //           name: 'Cây cà phê yếu dần, hệ thống rễ bị thối rữa và không thể hấp thụ chất dinh dưỡng',
  //           level: SymptomLevel.HIGH
  //         }
  //       ],
  //       preventions: [
  //         {
  //           name: 'Áp dụng đúng phương pháp canh tác',
  //           type: PreventionType.PHYSICS,
  //           effective: 5,
  //           instruction:
  //             '- Cần đảm bảo vườn cà phê có hệ thống thoát nước tốt, tránh tình trạng ngập úng sau mưa. Đất trồng cần được thường xuyên làm tơi xốp, giúp rễ cây dễ dàng hô hấp và tránh bị nấm tấn công.\n' +
  //             '- Ngoài ra, cần kiểm soát mật độ trồng cây hợp lý, tránh trồng quá dày khiến cây thiếu ánh sáng và không khí. Việc bón phân đầy đủ và cân đối cũng rất quan trọng, giúp cây phát triển khỏe mạnh và kháng bệnh tốt hơn. Trong các giai đoạn đầu của cây, có thể sử dụng các loại thuốc phòng ngừa nấm để ngăn chặn bệnh lở cổ rễ cà phê.\n' +
  //             '- Khi phát hiện cây cà phê bị bệnh lở cổ rễ, việc xử lý nhanh chóng là rất quan trọng để ngăn chặn sự lây lan của bệnh. Trước hết, cần tiến hành loại bỏ ngay những cây đã bị nhiễm nặng để tránh nấm lây lan sang các cây khác trong vườn. Sau đó, tiến hành xử lý đất bằng các loại thuốc diệt nấm chuyên dụng để tiêu diệt hoàn toàn các bào tử nấm trong đất.',
  //           note: ''
  //         },
  //         {
  //           name: 'Sử dụng phân bón hữu cơ',
  //           type: PreventionType.CHEMISTRY,
  //           effective: 4,
  //           instruction:
  //             'Tăng cường bón phân hữu cơ, giúp cây phục hồi và tăng cường sức đề kháng. Việc tưới nước cần được điều chỉnh sao cho đất luôn khô thoáng, tránh tình trạng ngập úng. Sử dụng các loại phân vi sinh, phân bón lá cũng có thể giúp cải thiện hệ thống rễ của cây cà phê, giúp cây kháng bệnh tốt hơn.',
  //           note:
  //             '- Đảm bảo bón đúng phân và đúng liều lượng để cho cây có thể phát triển.\n' +
  //             '- Cân nhắc các loại phân bón như: Phân chuồng, phân NPK hoặc các loại phân bón hữu cơ sinh học.'
  //         }
  //       ],
  //       time: {
  //         startTime: new Date('2023-09-01'),
  //         endTime: new Date('2023-12-31'),
  //         season: SeasonType.WINTER
  //       },
  //       image:
  //         'https://res.cloudinary.com/dbimwvmcy/image/upload/v1735106705/coffee-plant-handbook/npm35bbtqultjeymna1o.png'
  //     },
  //     {
  //       name: 'Bệnh vàng lá thối rễ',
  //       reason:
  //         'Bệnh vàng lá thối rễ do tuyến trùng Pratylenchus coffeae kết hợp cùng tuyến trùng Meloidogyne sp. và nấm ký sinh Fusarium solani và Rhizoctonia solani gây ra.',
  //       description:
  //         'Bệnh vàng lá thối rễ được xem là “ác mộng” của người trồng cà phê vì nó ảnh hưởng đến năng suất cây trồng và có thể hủy hoại cả vườn cây.',
  //       effectedVarieties: [
  //         new Types.ObjectId('676aca6f94501af32c8a3c6e'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c6f'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c70')
  //       ],
  //       symptoms: [
  //         {
  //           name: 'Lá chuyển sang màu vàng.',
  //           level: SymptomLevel.LOW
  //         },
  //         {
  //           name: 'Cành lá héo khô, lá có dấu hiệu rụng hàng loạt',
  //           level: SymptomLevel.HIGH
  //         },
  //         {
  //           name: 'Rễ bị thối đen',
  //           level: SymptomLevel.MEDIUM
  //         }
  //       ],
  //       preventions: [
  //         {
  //           name: 'Sử dụng thuốc hoá học trị bệnh',
  //           type: PreventionType.CHEMISTRY,
  //           effective: 4,
  //           instruction:
  //             'Phát hiện sớm bệnh vàng lá thối rễ, dùng 500g Eddy 72WP + 250g Hợp Trí Super Humic + 500ml Carbosan 25EC + 20g Thiamax 25WG /phuy 200 lít, tưới 5-10 lít dung dịch/gốc, tập trung vào vùng cổ rễ, tưới 2–3 lần cách nhau 7–10 ngày.',
  //           note: ''
  //         },
  //         {
  //           name: 'Sử dụng phân bón hữu cơ',
  //           type: PreventionType.BIOLOGY,
  //           effective: 3,
  //           instruction:
  //             'Nên bón kết hợp nhiều phân hữu cơ, đặc biệt là phân chuồng (20 - 40 kg/gốc) với Nấm đối kháng Trichoderma nhằm tiêu diệt mầm bệnh gây hại có trong đất để tăng thêm sức đề kháng cho cây.',
  //           note: ''
  //         },
  //         {
  //           name: 'Áp dụng các phương pháp canh tác',
  //           type: PreventionType.PHYSICS,
  //           effective: 5,
  //           instruction: '',
  //           note: ''
  //         }
  //       ],
  //       time: {
  //         startTime: new Date('2023-04-01'),
  //         endTime: new Date('2023-06-31'),
  //         season: SeasonType.SUMMER
  //       },
  //       image:
  //         'https://res.cloudinary.com/dbimwvmcy/image/upload/v1735106734/coffee-plant-handbook/eol7bioqkpauqgbayqut.png'
  //     },
  //     {
  //       name: 'Bệnh thối nứt thân',
  //       reason: 'Nấm gây bệnh thối nứt thân (Fusarium sp.)',
  //       description:
  //         'Bệnh phát tán dễ dàng trong không khí và được lan truyền nhanh nhờ gió, nước, côn trùng, động vật...',
  //       effectedVarieties: [
  //         new Types.ObjectId('676aca6f94501af32c8a3c6e'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c6f'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c70')
  //       ],
  //       symptoms: [
  //         {
  //           name: 'Thân cây bị thối nứt.',
  //           level: SymptomLevel.HIGH
  //         },
  //         {
  //           name: 'Lá chuyển vàng rụng nhiều',
  //           level: SymptomLevel.LOW
  //         },
  //         {
  //           name: 'Thân có nấm ẩm ướt dễ gãy',
  //           level: SymptomLevel.MEDIUM
  //         },
  //         {
  //           name: 'Rễ cọc của cây thối và bị đứt ngang.',
  //           level: SymptomLevel.HIGH
  //         }
  //       ],
  //       preventions: [
  //         {
  //           name: 'Sử dụng  một số chế phẩm sinh học của nấm Trichoderma',
  //           type: PreventionType.BIOLOGY,
  //           effective: 5,
  //           instruction:
  //             'Áp dụng tốt các biện pháp làm cành, rong tỉa cây che bóng – chắn gió, làm cỏ… để vườn cây thông thoáng, hạn chế nấm bệnh phát triển. Đầu mùa mưa hàng năm (tháng 4 – 5) nên áp dụng biện pháp quét vôi lên thân cây cà phê cách mặt đất 40 – 60cm để phòng tránh bệnh phát triển và lây lan. Một số chế phẩm sinh học của nấm Trichoderma cũng có thể được dùng để phun lên thân cây vào đầu mùa mưa để phòng tránh bệnh phát triển và lây lan.',
  //           note: 'Sử dụng đúng liều lượng'
  //         }
  //       ],
  //       time: {
  //         startTime: new Date('2023-08-01'),
  //         endTime: new Date('2023-11-31'),
  //         season: SeasonType.FALL
  //       },
  //       image:
  //         'https://res.cloudinary.com/dbimwvmcy/image/upload/v1735106769/coffee-plant-handbook/xsnmdlgmeyax482wbjr7.png'
  //     },
  //     {
  //       name: 'Bệnh héo rũ',
  //       reason: 'Bệnh do nấm Fusarium sp. gây ra.',
  //       description:
  //         'Bệnh héo rũ cà phê (Gibberella xylarioides) hay có tên gọi khác là bệnh chết nhanh cây cà phê - là một trong những nguy cơ tiềm ẩn lớn nhất cho ngành cà phê Việt Nam.',
  //       effectedVarieties: [
  //         new Types.ObjectId('676aca6f94501af32c8a3c6e'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c6f'),
  //         new Types.ObjectId('676aca6f94501af32c8a3c70')
  //       ],
  //       symptoms: [
  //         {
  //           name: 'Lá cà phê chuyển sang màu vàng úa, sau đó héo rũ dần.',
  //           level: SymptomLevel.LOW
  //         },
  //         {
  //           name: 'Lá héo rũ lan ra toàn bộ cây',
  //           level: SymptomLevel.MEDIUM
  //         },
  //         {
  //           name: 'Cành và thân cây mềm nhũn và dễ gãy',
  //           level: SymptomLevel.MEDIUM
  //         },
  //         {
  //           name: 'Rễ cà phê bị chuyển sang màu nâu đen và dẫn thối nhũn.',
  //           level: SymptomLevel.HIGH
  //         }
  //       ],
  //       preventions: [
  //         {
  //           name: 'Sử dụng các loại phân bón sinh học',
  //           type: PreventionType.BIOLOGY,
  //           effective: 3,
  //           instruction:
  //             'Thường xuyên sử dụng phân chuồng, phân lân và kết hợp cùng trichiderma để bón phân cho cây cà phê. Vì phân chuồng hoai mục sẽ giúp cây được bổ sung chất dinh dưỡng, phân lân có tác dụng kích thích rễ sinh trưởng mạnh và trichoderma giúp ức chế quá trình sinh trưởng của nấm.',
  //           note: ''
  //         },
  //         {
  //           name: 'Sử dụng các loại thuốc hoá học',
  //           type: PreventionType.CHEMISTRY,
  //           effective: 4,
  //           instruction:
  //             'Có thể sử dụng các loại thuốc hóa học chứa các thành phần: difenoconazoll, hexaconazole, propiconazole, tebuconazole hoặc hỗn hợp của các thành phần này để hạn chế được bệnh vàng lá thối rễ.',
  //           note: ''
  //         },
  //         {
  //           name: 'Áp dụng các biện pháp canh tác',
  //           type: PreventionType.PHYSICS,
  //           effective: 5,
  //           instruction:
  //             'Thường xuyên kiểm tra vườn để phát hiện bệnh trên cây kịp thời. Đồng thời, cần vệ sinh vườn bằng cách dọn cỏ xung quanh gốc cây để tránh tạo môi trường ẩm ướt. Tỉa cành để tạo sự thông thoáng nhằm tránh sự phát triển của mầm bệnh.',
  //           note: ''
  //         }
  //       ],
  //       time: {
  //         startTime: new Date('2023-10-01'),
  //         endTime: new Date('2023-12-31'),
  //         season: SeasonType.WINTER
  //       },
  //       image:
  //         'https://res.cloudinary.com/dbimwvmcy/image/upload/v1735106796/coffee-plant-handbook/var7sa1jvqbxqt1wfefp.png'
  //     }
  //   ])
  // }

  public create(Disease: any, options?: SaveOptions | undefined) {
    return this.diseaseRepository.create(Disease, options)
  }

  public async findById(diseaseId: string, projection?: string | Record<string, any>) {
    const disease = await this.diseaseRepository.findOne({
      conditions: {
        _id: diseaseId
      },
      projection,
      populates: [
        {
          path: 'effectedVarieties',
          select: ['_id', 'name', 'scientificName', 'image']
        }
      ]
    })
    return disease
  }

  public update(conditions: FilterQuery<Disease>, payload: UpdateQuery<Disease>, options?: QueryOptions | undefined) {
    return this.diseaseRepository.findOneAndUpdate(conditions, payload, options)
  }

  async list(pagination: PaginationParams, queryDiseaseDto: QueryDiseaseDto, projection = DISEASE_LIST_PROJECTION) {
    const { search } = queryDiseaseDto
    const filter: Record<string, any> = {}

    // const validStatus = status?.filter((status) => [DiseaseStatus.ACTIVE].includes(status))
    // if (validStatus?.length > 0) {
    //   filter['status'] = {
    //     $in: validStatus
    //   }
    // }

    let textSearch = ''
    if (search) textSearch += search.trim()
    if (textSearch) {
      filter['$text'] = {
        $search: textSearch
      }
    }

    return this.diseaseRepository.model.paginate(filter, {
      ...pagination,
      projection,
      populate: [
        {
          path: 'effectedVarieties',
          select: ['_id', 'name', 'scientificName', 'image']
        }
      ]
    })
  }

  public async findMany(
    conditions: FilterQuery<DiseaseDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const diseases = await this.diseaseRepository.findMany({
      conditions,
      projection,
      populates
    })
    return diseases
  }

  countDisease(conditions: FilterQuery<DiseaseDocument>): Promise<number> {
    return this.diseaseRepository.model.countDocuments(conditions)
  }

  async countSymptom(conditions: FilterQuery<DiseaseDocument>): Promise<number> {
    const result = await this.diseaseRepository.model.aggregate([
      {
        $unwind: {
          path: '$symptoms'
        }
      },
      {
        $count: 'count'
      }
    ])
    return result[0]?.count || 0
  }

  async countPrevention(conditions: FilterQuery<DiseaseDocument>): Promise<number> {
    const result = await this.diseaseRepository.model.aggregate([
      {
        $unwind: {
          path: '$preventions'
        }
      },
      {
        $count: 'count'
      }
    ])
    return result[0]?.count || 0
  }

  getSymptomReportByLevel() {
    return this.diseaseRepository.model.aggregate([
      {
        $unwind: {
          path: '$symptoms'
        }
      },
      {
        $project: {
          symptoms: 1
        }
      },
      {
        $group: {
          _id: '$symptoms.level',
          count: {
            $count: {}
          }
        }
      }
    ])
  }

  getDiseaseReportByMonth() {
    return this.diseaseRepository.model.aggregate([
      {
        $project: {
          startMonth: {
            $month: '$time.startTime'
          },
          endMonth: {
            $month: '$time.endTime'
          }
        }
      }
    ])
  }
}
