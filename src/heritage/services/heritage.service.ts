import { PaginationParams } from '@common/decorators/pagination.decorator'
import { HERITAGE_LIST_PROJECTION } from '@heritage/contracts/constant'
import { QueryHeritageDto } from '@heritage/dto/view-heritage.dto'
import { Injectable, Inject } from '@nestjs/common'
import { IHeritageRepository } from '@src/heritage/repositories/heritage.repository'
import { Heritage, HeritageDocument } from '@src/heritage/schemas/heritage.schema'
import { Aggregate, FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'

export const IHeritageService = Symbol('IHeritageService')

export interface IHeritageService {
  create(heritage: any, options?: SaveOptions | undefined): Promise<HeritageDocument>
  findById(heritageId: string, projection?: string | Record<string, any>): Promise<HeritageDocument>
  findBySlug(slug: string, projection?: string | Record<string, any>): Promise<HeritageDocument>
  update(
    conditions: FilterQuery<Heritage>,
    payload: UpdateQuery<Heritage>,
    options?: QueryOptions | undefined
  ): Promise<HeritageDocument>
  list(pagination: PaginationParams, queryHeritageDto: QueryHeritageDto)
  findMany(
    conditions: FilterQuery<HeritageDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<HeritageDocument[]>
  countHeritage(conditions: FilterQuery<HeritageDocument>): Promise<number>
  countSymptom(conditions: FilterQuery<HeritageDocument>): Promise<number>
  countPrevention(conditions: FilterQuery<HeritageDocument>): Promise<number>
  getSymptomReportByLevel(): Aggregate<any[]>
  getHeritageReportByMonth(): Aggregate<any[]>
}

@Injectable()
export class HeritageService implements IHeritageService {
  constructor(
    @Inject(IHeritageRepository)
    private readonly heritageRepository: IHeritageRepository
  ) {}

  // async onModuleInit() {
  //   await this.heritageRepository.model.insertMany([
  //     {
  //       name: 'Không gian văn hóa Cồng Chiêng Tây Nguyên',
  //       slug: 'khong-gian-van-hoa-cong-chieng-tay-nguyen',
  //       shortDescription:
  //         'Di sản văn hóa phi vật thể đại diện của nhân loại, bao gồm cồng chiêng, các nghi lễ, lễ hội liên quan.',
  //       detailedDescription:
  //         'Không gian văn hóa Cồng Chiêng Tây Nguyên trải rộng trên 5 tỉnh: Kon Tum, Gia Lai, Đắk Lắk, Đắk Nông và Lâm Đồng. Cồng chiêng không chỉ là nhạc cụ mà còn là một phần không thể thiếu trong đời sống văn hóa, tâm linh của nhiều dân tộc bản địa.',
  //       type: 'phi-vat-the',
  //       typicalValue: 'Thể hiện bản sắc văn hóa, lịch sử và sự sáng tạo nghệ thuật độc đáo của các dân tộc Tây Nguyên.',
  //       image:
  //         'https://images.vietnamtourism.gov.vn/vn//images/2023/thang12/521-kon_tum-phuocsonkt%40gmailcom-le_hoi_mung_lua_moi.jpg',
  //       video: 'https://www.youtube.com/watch?v=YOUR_YOUTUBE_VIDEO_ID_1',
  //       relatedCommunity: "Các dân tộc Ê Đê, Ba Na, Xơ Đăng, Giẻ Triêng, M'nông, Cơ Ho, Mạ, Lô Lô,...",
  //       creationTime: null,
  //       origin: null,
  //       location: null
  //     },
  //     {
  //       name: 'Nhà Rông',
  //       slug: 'nha-rong',
  //       shortDescription: 'Kiến trúc nhà sàn cộng đồng đặc trưng của nhiều dân tộc Tây Nguyên.',
  //       detailedDescription:
  //         'Nhà Rông là ngôi nhà chung của buôn làng, nơi diễn ra các hoạt động cộng đồng quan trọng như hội họp, lễ nghi. Kiến trúc của nhà Rông thường cao lớn, mái dốc, trang trí hoa văn độc đáo.',
  //       type: 'vat-the',
  //       location: 'Khắp các buôn làng Tây Nguyên',
  //       creationTime: null,
  //       origin: 'Truyền thống lâu đời của các dân tộc',
  //       typicalValue: 'Biểu tượng của sự đoàn kết cộng đồng, kiến trúc độc đáo.',
  //       image:
  //         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/BahnarRong.jpg/500px-BahnarRong.jpg',
  //       video: null,
  //       relatedCommunity: null
  //     },
  //     {
  //       name: 'Lễ hội Cồng Chiêng',
  //       slug: 'le-hoi-cong-chieng',
  //       shortDescription: 'Các lễ hội gắn liền với diễn tấu cồng chiêng, mang đậm bản sắc văn hóa.',
  //       detailedDescription:
  //         'Các lễ hội cồng chiêng thường được tổ chức vào các dịp quan trọng của cộng đồng như mừng lúa mới, lễ trưởng thành, cưới hỏi. Đây là dịp để cộng đồng cùng nhau thưởng thức âm nhạc cồng chiêng và thực hiện các nghi lễ truyền thống.',
  //       type: 'phi-vat-the',
  //       typicalValue: 'Bảo tồn và phát huy giá trị của cồng chiêng, gắn kết cộng đồng.',
  //       image: 'https://images.vietnamtourism.gov.vn/vn//images/2023/thang12/le_hoi_cong_chieng_tay_nguyen_-_gia_tri_van_hoa_ngan_doi_-_baodantocvn.jpg',
  //       video: 'https://www.youtube.com/watch?v=YOUR_YOUTUBE_VIDEO_ID_2',
  //       relatedCommunity: 'Các dân tộc có truyền thống sử dụng cồng chiêng',
  //       creationTime: null,
  //       origin: null,
  //       location: null
  //     },
  //     {
  //       name: "Trường ca Tây Nguyên (Khan, H'mon)",
  //       slug: 'truong-ca-tay-nguyen',
  //       shortDescription: 'Hình thức kể chuyện truyền thống bằng thơ vần, có giá trị văn học và lịch sử.',
  //       detailedDescription:
  //         "Trường ca như Khan của người Ba Na, Xơ Đăng hay H'mon của người M'nông là những tác phẩm tự sự bằng thơ, thường được diễn xướng trong các dịp lễ hội hoặc sinh hoạt cộng đồng. Nội dung thường kể về lịch sử, truyền thuyết, phong tục tập quán.",
  //       type: 'phi-vat-the',
  //       typicalValue: 'Lưu giữ lịch sử, văn hóa, truyền thống thông qua hình thức diễn xướng độc đáo.',
  //       image: 'https://dotchuoinon.com/wp-content/uploads/2011/06/taynguyen.jpg',
  //       video: 'https://www.youtube.com/watch?v=YOUR_YOUTUBE_VIDEO_ID_3',
  //       relatedCommunity: "Các dân tộc Ba Na, Xơ Đăng, M'nông,...",
  //       creationTime: null,
  //       origin: null,
  //       location: null
  //     },
  //     {
  //       name: 'Tượng nhà mồ',
  //       slug: 'tuong-nha-mo',
  //       shortDescription: 'Nghệ thuật điêu khắc gỗ độc đáo, thường gắn liền với các nghi lễ tang ma.',
  //       detailedDescription:
  //         'Tượng nhà mồ là những tác phẩm điêu khắc gỗ dân gian, thể hiện thế giới quan, tín ngưỡng của các dân tộc Tây Nguyên về cuộc sống và cái chết. Các hình tượng thường phong phú, từ người, động vật đến các vật dụng quen thuộc.',
  //       type: 'vat-the',
  //       location: 'Các khu vực có tục làm nhà mồ ở Tây Nguyên',
  //       creationTime: null,
  //       origin: 'Truyền thống tang lễ của các dân tộc',
  //       typicalValue: 'Nghệ thuật điêu khắc độc đáo, thể hiện tín ngưỡng tâm linh.',
  //       image:
  //         'https://cly.1cdn.vn/2021/10/13/dantoctongiao.congly.vn-upload-content_img-2021-1013-_nhieu-sac-thai-cua-tuong-nha-mo-anh-internet_anh_2.jpg',
  //       video: null,
  //       relatedCommunity: null
  //     },
  //     {
  //       name: 'Lễ Bỏ Mả',
  //       slug: 'le-bo-ma',
  //       shortDescription:
  //         'Nghi lễ quan trọng trong vòng đời của người Tây Nguyên, tiễn đưa người chết về thế giới bên kia.',
  //       detailedDescription:
  //         'Lễ Bỏ Mả (hay còn gọi là Pơ Thi) là một trong những nghi lễ lớn nhất và tốn kém nhất của một số dân tộc Tây Nguyên. Mục đích là để kết thúc tang lễ, tiễn đưa linh hồn người chết về với tổ tiên.',
  //       type: 'phi-vat-the',
  //       typicalValue: 'Thể hiện quan niệm về vòng đời, tín ngưỡng về thế giới bên kia.',
  //       image: 'https://images.baodantoc.vn/uploads/2023/Th%C3%A1ng%202/Ng%C3%A0y_20/Anh/2%20BM.jpg',
  //       video: 'https://www.youtube.com/watch?v=YOUR_YOUTUBE_VIDEO_ID_4',
  //       relatedCommunity: 'Các dân tộc Gia Rai, Ba Na,...',
  //       creationTime: null,
  //       origin: null,
  //       location: null
  //     },
  //     {
  //       name: 'Dệt thổ cẩm',
  //       slug: 'det-tho-cam',
  //       shortDescription: 'Nghề thủ công truyền thống tạo ra những sản phẩm dệt có hoa văn độc đáo.',
  //       detailedDescription:
  //         'Nghề dệt thổ cẩm của các dân tộc Tây Nguyên nổi tiếng với kỹ thuật tinh xảo và những hoa văn mang đậm bản sắc văn hóa. Các sản phẩm thổ cẩm được sử dụng trong trang phục, đồ dùng sinh hoạt và các nghi lễ.',
  //       type: 'phi-vat-the',
  //       typicalValue: 'Kỹ năng thủ công truyền thống, thể hiện sự sáng tạo nghệ thuật.',
  //       image: 'https://nguoiduatin.mediacdn.vn/media/ho-hai-nam/2020/09/02/anh-1-2.JPG',
  //       video: 'https://www.youtube.com/watch?v=YOUR_YOUTUBE_VIDEO_ID_5',
  //       relatedCommunity: 'Hầu hết các dân tộc ở Tây Nguyên',
  //       creationTime: null,
  //       origin: null,
  //       location: null
  //     },
  //     {
  //       name: 'Nhạc cụ tre nứa',
  //       slug: 'nhac-cu-tre-nua',
  //       shortDescription: 'Các loại nhạc cụ được chế tác từ tre, nứa, mang âm thanh đặc trưng của núi rừng.',
  //       detailedDescription:
  //         "Tây Nguyên có một kho tàng nhạc cụ độc đáo làm từ tre, nứa như đàn T'rưng, đàn K'long Pút, sáo, khèn bè,... Mỗi loại nhạc cụ mang một âm sắc riêng, góp phần tạo nên sự phong phú của âm nhạc truyền thống.",
  //       type: 'vat-the',
  //       location: 'Khắp Tây Nguyên',
  //       creationTime: null,
  //       origin: 'Sự sáng tạo của người dân bản địa',
  //       typicalValue: 'Âm thanh độc đáo, gắn liền với đời sống văn hóa tinh thần.',
  //       image: 'https://image.phunuonline.com.vn/fckeditor/upload/2023/20231102/images/kham-pha-kho-nhac-cu-_571698945203.jpg',
  //       video: 'https://www.youtube.com/watch?v=YOUR_YOUTUBE_VIDEO_ID_6',
  //       relatedCommunity: null
  //     },
  //     {
  //       name: 'Uống rượu cần',
  //       slug: 'uong-ruou-can',
  //       shortDescription: 'Phong tục uống rượu chung bằng cần trong các dịp lễ, hội hoặc tiếp khách.',
  //       detailedDescription:
  //         'Uống rượu cần là một nét văn hóa đặc trưng, thể hiện sự gắn bó cộng đồng và lòng hiếu khách. Mọi người cùng nhau quây quần bên ché rượu cần, dùng những chiếc cần để hút rượu.',
  //       type: 'phi-vat-the',
  //       typicalValue: 'Thể hiện sự gắn kết cộng đồng, lòng hiếu khách.',
  //       image:
  //         'https://mtcs.1cdn.vn/2019/02/03/moitruong.net.vn-wp-content-uploads-2019-02-_yi-1.jpg',
  //       video: 'https://www.youtube.com/watch?v=YOUR_YOUTUBE_VIDEO_ID_7',
  //       relatedCommunity: 'Nhiều dân tộc ở Tây Nguyên',
  //       creationTime: null,
  //       origin: null,
  //       location: null
  //     },
  //     {
  //       name: 'Gươl (Nhà làng của người Cơ Tu)',
  //       slug: 'guol-nha-lang-cua-nguoi-co-tu',
  //       shortDescription: 'Ngôi nhà cộng đồng đặc trưng của người Cơ Tu, tương tự như nhà Rông.',
  //       detailedDescription:
  //         'Gươl là trung tâm văn hóa, xã hội của làng người Cơ Tu, nơi diễn ra các hoạt động quan trọng. Kiến trúc Gươl có những nét độc đáo riêng, thể hiện bản sắc của dân tộc Cơ Tu.',
  //       type: 'vat-the',
  //       location: 'Các làng của người Cơ Tu ở Tây Nguyên',
  //       creationTime: null,
  //       origin: 'Truyền thống của người Cơ Tu',
  //       typicalValue: 'Biểu tượng văn hóa, nơi sinh hoạt cộng đồng.',
  //       image:
  //         'https://bqn.1cdn.vn/2024/02/02/qno1.baoquangnam.vn-storage-newsportal-2024-1-27-155363-_tnb-61871.jpgs',
  //       video: null,
  //       relatedCommunity: null
  //     },
  //     {
  //       name: 'Đàn đá',
  //       slug: 'dan-da',
  //       shortDescription: 'Nhạc cụ cổ sơ làm từ những thanh đá có kích thước khác nhau, tạo ra âm thanh độc đáo.',
  //       detailedDescription:
  //         'Đàn đá Tây Nguyên là một trong những loại nhạc cụ đá cổ xưa nhất của nhân loại. Âm thanh của đàn đá mang vẻ hoang sơ, kỳ bí, gắn liền với đời sống tinh thần của người dân bản địa.',
  //       type: 'vat-the',
  //       location: 'Các tỉnh Tây Nguyên',
  //       creationTime: null,
  //       origin: 'Sự khám phá và sáng tạo của người xưa',
  //       typicalValue: 'Nhạc cụ cổ, giá trị lịch sử và văn hóa độc đáo.',
  //       image:
  //         'https://cdn.baogialai.com.vn/images/822863faa89937513fac62d7aa33eaf614b5948cc25f6f94fb9ca772ba954f615bb05a49ccb2ccda48563495a0b057748be3f95db550267d9a7f5f77b0281750c2e4e7489a871ebbae2ab69c32bc7619/images2802052_1dandaanh_chinh.jpg',
  //       video: 'https://www.youtube.com/watch?v=YOUR_YOUTUBE_VIDEO_ID_9',
  //       relatedCommunity: null
  //     },
  //     {
  //       name: "Cồng chiêng của người M'nông",
  //       slug: 'cong-chieng-cua-nguoi-m-nong',
  //       shortDescription: "Bộ cồng chiêng độc đáo của người M'nông với những sắc thái âm nhạc riêng.",
  //       detailedDescription:
  //         "Cồng chiêng là một phần không thể thiếu trong đời sống văn hóa tinh thần của người M'nông. Mỗi bộ cồng chiêng có số lượng và cách thức sử dụng khác nhau, tạo nên những âm hưởng đặc trưng trong các lễ hội và sinh hoạt cộng đồng.",
  //       type: 'phi-vat-the',
  //       typicalValue: "Thể hiện bản sắc văn hóa âm nhạc của người M'nông.",
  //       image: 'https://images.baodantoc.vn/uploads/2021/Th%C3%A1ng_11/Ng%C3%A0y_25/NG%C3%82N/m%C3%BAa%20m%C3%B4ng/z2965172154866_c9a9ba6596f65b0f68307c05e233a935.jpg',
  //       video: null,
  //       relatedCommunity: "Người M'nông",
  //       creationTime: null,
  //       origin: null,
  //       location: null
  //     },
  //     {
  //       name: 'Nhà dài Ê Đê',
  //       slug: 'nha-dai-e-de',
  //       shortDescription: 'Kiến trúc nhà sàn dài độc đáo của người Ê Đê, thể hiện chế độ mẫu hệ.',
  //       detailedDescription:
  //         'Nhà dài của người Ê Đê có chiều dài ấn tượng, có khi lên đến hàng trăm mét, là nơi cư trú của nhiều thế hệ trong một gia đình mẫu hệ. Kiến trúc và cách bài trí bên trong phản ánh rõ nét các tập tục và quan niệm xã hội của người Ê Đê.',
  //       type: 'vat-the',
  //       location: 'Đắk Lắk',
  //       creationTime: null,
  //       origin: 'Truyền thống lâu đời của người Ê Đê',
  //       typicalValue: 'Kiến trúc độc đáo, biểu tượng của chế độ mẫu hệ.',
  //       image: 'https://ddk.1cdn.vn/2024/01/12/2.jpg',
  //       video: null,
  //       relatedCommunity: null
  //     },
  //     {
  //       name: 'Lễ cúng cơm mới của người Gia Rai',
  //       slug: 'le-cung-com-moi-cua-nguoi-gia-rai',
  //       shortDescription: 'Nghi lễ quan trọng sau mùa gặt, tạ ơn thần linh và cầu mong mùa màng tiếp theo.',
  //       detailedDescription:
  //         'Lễ cúng cơm mới là một trong những lễ hội lớn của người Gia Rai, được tổ chức sau khi thu hoạch xong vụ mùa. Đây là dịp để tạ ơn các vị thần đã ban cho một mùa màng bội thu và cầu mong sự ấm no, hạnh phúc cho cả cộng đồng.',
  //       type: 'phi-vat-the',
  //       typicalValue: 'Thể hiện lòng biết ơn đối với thiên nhiên và các vị thần.',
  //       image:
  //         'https://mia.vn/media/uploads/blog-du-lich/le-cung-com-moi-net-van-hoa-cua-dong-bao-tay-nguyen-1-1635895150.jpg',
  //       video: null,
  //       relatedCommunity: 'Người Gia Rai',
  //       creationTime: null,
  //       origin: null,
  //       location: null
  //     },
  //     {
  //       name: "Nhạc cụ K'long Pút",
  //       slug: 'nhac-cu-k-long-put',
  //       shortDescription: 'Loại nhạc cụ hơi độc đáo làm từ ống lồ ô, tạo ra âm thanh trầm bổng.',
  //       detailedDescription:
  //         "K'long Pút là một loại nhạc cụ độc đáo của người Ba Na và Xơ Đăng, được làm từ những ống lồ ô có kích thước khác nhau. Người chơi dùng hơi thở để tạo ra những âm thanh du dương, thường được исполняется bởi phụ nữ.",
  //       type: 'vat-the',
  //       location: 'Gia Lai, Kon Tum',
  //       creationTime: null,
  //       origin: 'Sáng tạo của người Ba Na và Xơ Đăng',
  //       typicalValue: 'Âm thanh độc đáo, gắn liền với đời sống văn hóa tinh thần của phụ nữ.',
  //       image: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Klong_put.png',
  //       video: 'https://www.youtube.com/watch?v=your_youtube_video_id_9',
  //       relatedCommunity: null
  //     },
  //     {
  //       name: 'Hát Ayray của người Ê Đê',
  //       slug: 'hat-ayray-cua-nguoi-e-de',
  //       shortDescription: 'Hình thức hát giao duyên, kể chuyện tình yêu và cuộc sống của người Ê Đê.',
  //       detailedDescription:
  //         'Hát Ayray là một loại hình nghệ thuật diễn xướng dân gian đặc sắc của người Ê Đê, thường được trình bày trong các dịp lễ hội, gặp gỡ. Nội dung các bài hát thường xoay quanh tình yêu đôi lứa, cuộc sống lao động và các phong tục tập quán.',
  //       type: 'phi-vat-the',
  //       typicalValue: 'Bảo tồn văn hóa ngôn ngữ, tình cảm và phong tục của người Ê Đê.',
  //       image: 'https://cand.com.vn/Files/Image/nguyenbinh/2020/02/14/thumb_660_4cdb8609-ed5e-4462-a84f-191382433b32.jpg',
  //       video: null,
  //       relatedCommunity: 'Người Ê Đê',
  //       creationTime: null,
  //       origin: null,
  //       location: null
  //     },
  //     {
  //       name: 'Rượu ghè',
  //       slug: 'ruou-ghe',
  //       shortDescription: 'Một dạng rượu cần đặc trưng, được ủ trong các ghè (bình gốm lớn).',
  //       detailedDescription:
  //         'Rượu ghè cũng là một hình thức uống rượu cộng đồng phổ biến ở Tây Nguyên, tương tự như rượu cần nhưng thường được ủ và chứa trong các ghè gốm lớn, có giá trị văn hóa và lịch sử.',
  //       type: 'vat-the',
  //       location: 'Khắp Tây Nguyên',
  //       creationTime: null,
  //       origin: 'Truyền thống của các dân tộc',
  //       typicalValue: 'Đồ uống truyền thống, gắn liền với các nghi lễ và sinh hoạt cộng đồng.',
  //       image: 'https://thegioidisan.vn/assets/media/2016/Thang%208/bun-do3.jpg',
  //       video: null,
  //       relatedCommunity: null
  //     },
  //     {
  //       name: 'Lễ hội Đâm trâu',
  //       slug: 'le-hoi-dam-trau',
  //       shortDescription: 'Lễ hội truyền thống của các dân tộc Tây Nguyên, hiến tế trâu để cầu mong sự phù hộ.',
  //       detailedDescription:
  //         'Lễ hội Đâm trâu là một nghi lễ quan trọng trong đời sống văn hóa tâm linh của nhiều dân tộc ở Tây Nguyên. Con trâu được chọn làm vật hiến tế để tạ ơn các vị thần linh và cầu mong sự bình an, ấm no cho buôn làng. Lễ hội thường đi kèm với các hoạt động cồng chiêng, múa hát và ăn uống cộng đồng.',
  //       type: 'phi-vat-the',
  //       location: null,
  //       creationTime: null,
  //       origin: 'Truyền thống lâu đời của các dân tộc Tây Nguyên',
  //       typicalValue: 'Thể hiện tín ngưỡng và sự gắn kết cộng đồng.',
  //       image:
  //         'https://cdn3.ivivu.com/2022/10/le-hoi-dam-trau-ivivu.jpg',
  //       video: null,
  //       relatedCommunity: 'Nhiều dân tộc ở Tây Nguyên'
  //     },
  //     {
  //       name: "Nhạc cụ T'rưng",
  //       slug: 'nhac-cu-t-rung',
  //       shortDescription: 'Nhạc cụ gõ làm từ các ống tre có kích thước khác nhau, tạo ra âm thanh độc đáo.',
  //       detailedDescription:
  //         "Đàn T'rưng là một loại nhạc cụ gõ truyền thống phổ biến ở Tây Nguyên, được làm từ nhiều ống tre có độ dài ngắn khác nhau, treo trên một giá đỡ. Khi gõ vào các ống, chúng tạo ra những âm thanh vang vọng, trong trẻo, mang đậm sắc thái núi rừng.",
  //       type: 'vat-the',
  //       location: 'Khắp Tây Nguyên',
  //       creationTime: null,
  //       origin: 'Sáng tạo của các dân tộc Tây Nguyên',
  //       typicalValue: 'Nhạc cụ độc đáo, âm thanh đặc trưng.',
  //       image:
  //         'https://mpod.vn/wp-content/uploads/2024/03/hinh-anh-nhac-cu3-1.jpg',
  //       video: null,
  //       relatedCommunity: null
  //     },
  //     {
  //       name: 'Lễ hội Cồng chiêng',
  //       slug: 'le-hoi-cong-chieng',
  //       shortDescription: 'Các lễ hội cồng chiêng đặc sắc của Tây Nguyên.',
  //       detailedDescription:
  //         'Các lễ hội cồng chiêng ở đây thường mang đậm bản sắc văn hóa của các dân tộc như Gia Rai, Ba Na, với những nghi thức và diễn tấu độc đáo.',
  //       type: 'phi-vat-the',
  //       location: null,
  //       creationTime: null,
  //       origin: 'Truyền thống của các dân tộc',
  //       typicalValue: 'Bảo tồn và phát huy giá trị cồng chiêng.',
  //       image: 'https://mia.vn/media/uploads/blog-du-lich/le-hoi-cong-chieng-tay-nguyen-gia-tri-van-hoa-ngan-doi-9-1635892240.jpg',
  //       video: null,
  //       relatedCommunity: 'Người Gia Rai, Ba Na'
  //     },
  //     {
  //       name: 'Nhà Rông Kon Klor',
  //       slug: 'nha-rong-kon-klor',
  //       shortDescription: 'Một trong những nhà rông đẹp và tiêu biểu của Tây Nguyên.',
  //       detailedDescription:
  //         'Nhà Rông Kon Klor ở thành phố Kon Tum là một công trình kiến trúc truyền thống đặc sắc, thể hiện rõ nét vẻ đẹp và vai trò của nhà rông trong đời sống văn hóa cộng đồng. Với mái cao vút và các họa tiết trang trí tinh xảo, đây là một điểm đến văn hóa hấp dẫn.',
  //       type: 'vat-the',
  //       location: 'Kon Tum',
  //       creationTime: null,
  //       origin: 'Truyền thống của người Ba Na ở Kon Tum',
  //       typicalValue: 'Kiến trúc độc đáo, biểu tượng văn hóa.',
  //       image:
  //         'https://quantri.kontum.gov.vn///Upload/Images/Normal/2018/12/nharong1.jpg',
  //       video: null,
  //       relatedCommunity: null
  //     },
  //     {
  //       name: "Nhạc cụ K'lông Pút của người Ba Na và Xơ Đăng",
  //       slug: 'nhac-cu-k-long-put-cua-nguoi-ba-na-va-xo-dang',
  //       shortDescription: 'Loại nhạc cụ hơi độc đáo làm từ ống lồ ô.',
  //       detailedDescription:
  //         "K'lông Pút là một nhạc cụ độc đáo của người Ba Na và Xơ Đăng, được làm từ các ống lồ ô có kích thước khác nhau. Âm thanh của K'lông Pút thường du dương, trầm bổng, thường được исполняется bởi phụ nữ trong các dịp lễ hội hoặc khi làm việc trên rẫy.",
  //       type: 'vat-the',
  //       location: 'Gia Lai, Kon Tum',
  //       creationTime: null,
  //       origin: 'Sáng tạo của người Ba Na và Xơ Đăng',
  //       typicalValue: 'Âm thanh độc đáo, gắn liền với đời sống văn hóa.',
  //       image: 'https://adminvov1.vov.gov.vn/UploadImages/vov1/2019/thang_11/images2503555_20160319_083951.jpg',
  //       video: null,
  //       relatedCommunity: null
  //     },
  //     {
  //       name: 'Lễ hội trỉa lúa của người Rơ Măm',
  //       slug: 'le-hoi-tria-lua-cua-nguoi-ro-mam',
  //       shortDescription: 'Một nghi lễ nông nghiệp quan trọng của dân tộc Rơ Măm.',
  //       detailedDescription:
  //         'Lễ hội trỉa lúa là một nghi lễ truyền thống của người Rơ Măm, được tổ chức vào đầu mùa vụ để cầu mong một vụ mùa bội thu. Lễ hội thường có các nghi thức cúng tế, các hoạt động văn nghệ dân gian và các trò chơi cộng đồng.',
  //       type: 'phi-vat-the',
  //       location: null,
  //       creationTime: null,
  //       origin: 'Truyền thống của người Rơ Măm',
  //       typicalValue: 'Thể hiện tín ngưỡng nông nghiệp, gắn kết cộng đồng.',
  //       image: 'https://file3.qdnd.vn/data/images/0/2024/01/11/upload_2272/img_9609.jpg',
  //       video: null,
  //       relatedCommunity: 'Người Rơ Măm'
  //     }
  //   ])
  // }

  public create(Heritage: any, options?: SaveOptions | undefined) {
    return this.heritageRepository.create(Heritage, options)
  }

  public async findById(heritageId: string, projection?: string | Record<string, any>) {
    const heritage = await this.heritageRepository.findOne({
      conditions: {
        _id: heritageId
      },
      projection,
    })
    return heritage
  }

  public async findBySlug(slug: string, projection?: string | Record<string, any>) {
    const heritage = await this.heritageRepository.findOne({
      conditions: {
        slug: slug
      },
      projection,
    })
    return heritage
  }

  public update(conditions: FilterQuery<Heritage>, payload: UpdateQuery<Heritage>, options?: QueryOptions | undefined) {
    return this.heritageRepository.findOneAndUpdate(conditions, payload, options)
  }

  async list(pagination: PaginationParams, queryHeritageDto: QueryHeritageDto, projection = HERITAGE_LIST_PROJECTION) {
    const { search, type } = queryHeritageDto
    const filter: Record<string, any> = {}

    // const validStatus = status?.filter((status) => [HeritageStatus.ACTIVE].includes(status))
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


    console.log(type)
    if (type) {
      filter['type'] = type
    }

    return this.heritageRepository.model.paginate(filter, {
      ...pagination,
      projection,
    })
  }

  public async findMany(
    conditions: FilterQuery<HeritageDocument>,
    projection?: Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const heritages = await this.heritageRepository.findMany({
      conditions,
      projection,
      populates
    })
    return heritages
  }

  countHeritage(conditions: FilterQuery<HeritageDocument>): Promise<number> {
    return this.heritageRepository.model.countDocuments(conditions)
  }

  async countSymptom(conditions: FilterQuery<HeritageDocument>): Promise<number> {
    const result = await this.heritageRepository.model.aggregate([
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

  async countPrevention(conditions: FilterQuery<HeritageDocument>): Promise<number> {
    const result = await this.heritageRepository.model.aggregate([
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
    return this.heritageRepository.model.aggregate([
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

  getHeritageReportByMonth() {
    return this.heritageRepository.model.aggregate([
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
