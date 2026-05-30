import mongoose from 'mongoose';
import { BranchPlacementRecord } from './src/models/BranchPlacementRecord.models.js';
import Student from './src/models/Student.models.js';

mongoose.connect('mongodb+srv://snorlex:princesharma%40123@cluster0.v4xfxy0.mongodb.net/placementPortal').then(async () => {
  const collegeId = '6a1a347473033619f1604feb';
  const records = await BranchPlacementRecord.find({
    college: collegeId,
    placementSeasonYear: 2026
  }).populate('branch', 'name').lean();

  const enrichedRecords = await Promise.all(
    records.map(async (record) => {
      const branchName = record.branch?.name || '';
      const [totalStudents, eligibleStudents, placedStudentsCount] = await Promise.all([
        Student.countDocuments({
          college: collegeId,
          branch: branchName,
          placementSeasonYear: 2026
        }),
        Student.countDocuments({
          college: collegeId,
          branch: branchName,
          placementSeasonYear: 2026,
          placementBlocked: false
        }),
        Student.countDocuments({
          college: collegeId,
          branch: branchName,
          placementSeasonYear: 2026,
          placementStatus: { $in: ['placed', 'internship'] }
        })
      ]);

      return {
        branchName,
        totalStudents,
        eligibleStudents,
        placedStudents: placedStudentsCount
      };
    })
  );

  console.log('Records:', enrichedRecords);
  process.exit(0);
});
