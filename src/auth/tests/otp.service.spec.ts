import { TestBed, Mocked } from '@suites/unit'
import { Types } from 'mongoose'
import { IOtpRepository } from '@auth/repositories/otp.repository'
import { OtpDocument } from '@auth/schemas/otp.schema'
import { OtpService } from '@auth/services/otp.service'
import { UserRole } from '@common/contracts/constant'

describe('OtpService', () => {
  let otpService: OtpService
  let otpRepository: Mocked<IOtpRepository>

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(OtpService).compile()
    otpService = unit
    otpRepository = unitRef.get(IOtpRepository)
  })

  it('should create an OTP document', async () => {
    const createOtpDto = { userId: new Types.ObjectId(), role: UserRole.ACCOUNT, code: '123456', expiredAt: new Date() } // Create a sample DTO
    const expectedOtp = {
      _id: '_id',
      userId: new Types.ObjectId(),
      role: UserRole.ACCOUNT,
      code: '123456',
      expiredAt: new Date()
    } as OtpDocument // Expected OTP document

    otpRepository.create.mockResolvedValueOnce(expectedOtp)

    const result = await otpService.create(createOtpDto)

    expect(otpRepository.create).toHaveBeenCalled()
    expect(result).toEqual(expectedOtp)
  })

  it('should update an OTP document', async () => {
    const conditions = { userId: new Types.ObjectId(), role: UserRole.ACCOUNT }
    const payload = { code: '123457' }
    const updatedOtp = {
      userId: new Types.ObjectId(),
      role: UserRole.ACCOUNT,
      code: '123456',
      expiredAt: new Date()
    } as OtpDocument

    otpRepository.findOneAndUpdate.mockResolvedValueOnce(updatedOtp)

    const result = await otpService.update(conditions, payload, undefined)

    expect(otpRepository.findOneAndUpdate).toHaveBeenCalled()
    expect(result).toEqual(updatedOtp)
  })

  it('should find an OTP by code', async () => {
    const code = '123456'
    const foundOtp = {
      userId: new Types.ObjectId(),
      role: UserRole.ACCOUNT,
      code: '123456',
      expiredAt: new Date()
    } as OtpDocument

    otpRepository.findOne.mockResolvedValueOnce(foundOtp)

    const result = await otpService.findByCode(code)

    expect(result).toEqual(foundOtp)
    expect(otpRepository.findOne).toHaveBeenCalledWith({ conditions: { code } })
  })

  it('should find an OTP by userId and role', async () => {
    const userId = 'user123'
    const role = UserRole.ACCOUNT
    const foundOtp = {
      userId: new Types.ObjectId(),
      role: UserRole.ACCOUNT,
      code: '123456',
      expiredAt: new Date()
    } as OtpDocument

    otpRepository.findOne.mockResolvedValueOnce(foundOtp)

    const result = await otpService.findByUserIdAndRole(userId, role)

    expect(result).toEqual(foundOtp)
    expect(otpRepository.findOne).toHaveBeenCalledWith({ conditions: { userId, role } })
  })

  it('should delete an OTP by code', async () => {
    const code = '123456'

    otpRepository.model.deleteOne.mockResolvedValueOnce({} as any)

    await otpService.clearOtp(code)

    expect(otpRepository.model.deleteOne).toHaveBeenCalledWith({ code })
  })
})
