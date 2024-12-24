import { MediaType } from '@media/contracts/constant'
import { GenerateSignedUrlDto } from '@media/dto/generate-signed-url.dto'
import { UploadMediaViaBase64Dto } from '@media/dto/upload-media-via-base64.dto'
import { MediaService } from '@media/services/media.service'
import { Mocked, TestBed } from '@suites/unit'
import { UploadApiResponse, v2 } from 'cloudinary'

// Mock the cloudinary module
jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: jest.fn(),
      destroy: jest.fn()
    }
  }
}))

describe('MediaService', () => {
  let mediaService: MediaService
  let cloudinaryV2: Mocked<typeof v2>

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(MediaService).compile()
    mediaService = unit
    cloudinaryV2 = unitRef.get('CLOUDINARY_V2')
  })

  describe('create', () => {
    it('should return an object with timestamp and signature', async () => {
      const generateSignedUrlDto = { public_id: 'public_id', type: MediaType.upload }
      cloudinaryV2.utils.api_sign_request.mockReturnValue('c33941c9e98280e1e300de2f98f9efddcfbe9f60')
      const result = await mediaService.create(generateSignedUrlDto as GenerateSignedUrlDto)
      expect(result).toHaveProperty('timestamp')
      expect(result).toHaveProperty('signature')
    })
  })

  describe('uploadViaBase64', () => {
    it('should return an object', async () => {
      const uploadMediaViaBase64Dto = { contents: 'contents' }
      cloudinaryV2.uploader.upload.mockResolvedValue({
        url: 'http://example.com/sample.jpg',
        public_id: 'sample_id'
      } as UploadApiResponse)
      const result = await mediaService.uploadViaBase64(uploadMediaViaBase64Dto as UploadMediaViaBase64Dto)
      expect(result).toHaveProperty('url')
    })

    it('should throw an error', () => {
      const uploadMediaViaBase64Dto = { contents: '12345678910' }
      cloudinaryV2.uploader.upload.mockRejectedValue(new Error('Error'))
      expect(mediaService.uploadViaBase64(uploadMediaViaBase64Dto as UploadMediaViaBase64Dto)).rejects.toThrow()
    })
  })

  describe('uploadMultiple', () => {
    it('should return an array of objects', async () => {
      const images = ['image1', 'image2']
      cloudinaryV2.uploader.upload.mockResolvedValue({
        url: 'http://example.com/sample.jpg',
        public_id: 'sample_id'
      } as UploadApiResponse)
      const result = await mediaService.uploadMultiple(images)
      expect(result).toHaveLength(2)
    })
  })
})
