import React, { useState, useEffect, useCallback } from 'react';
import { SequenceData } from '../classes/SequenceController';
import { v4 as uuid } from 'uuid';
import createToast from '@src/components/Webflow/Features/Todo/utils/toast';
export function useSequenceOperations(sequenceController, treeData, setTreeData) {



  const handleAddChildSequence = useCallback((parentSequenceId: string, childName: string, payload: any) => {


    if (!payload) return;
    console.log('%cpayload', 'color: lightblue; font-size: 14px', payload);

    // Get the first key in the payload object


    // Parse the payload data
    const {
      sequence,
      pathSuggestions,
      sequencePaths,
    } = payload;


    // Create a new SequenceData object for the new child sequence
    const newChildSequenceData: SequenceData = {
      id: uuid(),
      name: childName || 'New Child',
      description: 'Child sequence description',
      sequencePaths: sequencePaths || {},
      pathSuggestions: pathSuggestions || [],
    };

    console.log('%cnewChildSequenceData', 'color: orange; font-size: 18px', newChildSequenceData);
    // Add the new child sequence to the SequenceController
    sequenceController.addSequence(newChildSequenceData, parentSequenceId);

    // Update the treeData state to reflect the new child sequence
    const parentSequence = findNodeById(treeData, parentSequenceId);
    if (parentSequence) {
      const newChildSequence: TreeNode = {
        id: newChildSequenceData.id,
        name: newChildSequenceData.name,
        description: newChildSequenceData.description,
        processName: newChildSequenceData.processName,
        sequencePaths: newChildSequenceData.sequencePaths,
        pathSuggestions: newChildSequenceData.pathSuggestions,
      };
      if (parentSequence.children) {
        parentSequence.children.push(newChildSequence);
      } else {
        parentSequence.children = [newChildSequence];
      }
      setTreeData({ ...treeData });
    }



  }, [treeData]);





  const handleAddChildSequenceFromIdea = useCallback((parentSequenceId: string, suggestion: Object, suggestedSequence: any) => {

    console.log('%csuggestedSequence', 'color: red; font-size: 44px', suggestedSequence);


    if (!suggestedSequence) return;
    console.log('%cSuggestedSequence', 'color: lightblue; font-size: 14px', suggestedSequence);
    createToast('yo')
    // Get the sequence, pathSuggestions, and sequencePaths from the payload
    const {
      sequencePaths,
      pathSuggestions,
      // sequencePaths,
    } = suggestedSequence;

    // If there's no sequencePayload, return early to avoid errors

    // Get the first key in the sequencePayload object



    // Extract the sequence data from the payload

    // Create a new SequenceData object for the new child sequence
    const newChildSequenceData: SequenceData = {
      id: uuid(),
      name: suggestion.topicName || '',
      description: suggestion.description || '',
      sequencePaths: sequencePaths || {},
      pathSuggestions: pathSuggestions || [],
    };

    console.log('%cnewChildSequenceData', 'color: orange; font-size: 18px', newChildSequenceData);
    // Add the new child sequence to the SequenceController



    sequenceController.addSequence(newChildSequenceData, parentSequenceId);

    // Update the treeData state to reflect the new child sequence
    const parentSequence = findNodeById(treeData, parentSequenceId);
    if (parentSequence) {
      const newChildSequence: TreeNode = {
        id: newChildSequenceData.id,
        name: newChildSequenceData.name,
        description: newChildSequenceData.description,
        processName: newChildSequenceData.processName,
        sequencePaths: newChildSequenceData.sequencePaths,
        pathSuggestions: newChildSequenceData.pathSuggestions,
      };
      if (parentSequence.children) {
        parentSequence.children.push(newChildSequence);
      } else {
        parentSequence.children = [newChildSequence];
      }
      setTreeData({ ...treeData });
    }
  }, [treeData]);








  const searchSequences = (node: TreeNode, term: string, results: TreeNode[] = []) => {
    if (node.name.toLowerCase().includes(term.toLowerCase()) || node.processName.toLowerCase().includes(term.toLowerCase())) {
      results.push(node);
    }
    if (node.children) {
      for (const child of node.children) {
        searchSequences(child, term, results);
      }
    }
    return results;
  };


  const handleUpdateTreeData = (updatedTreeData) => {
    // Update the treeData state
    setTreeData(...updatedTreeData);
  };


  const findParentNodeById = (node: TreeNode, id: string, parent: TreeNode | null = null): TreeNode | null => {
    if (node.id === id) {
      return parent;
    }
    if (node.children) {
      for (const child of node.children) {
        const found = findParentNodeById(child, id, node);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };



  const findNodeById = (node: TreeNode, id: string): TreeNode | null => {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };


  const handleUpdateSequence = (sequenceId, updatedName, updatedProcessName, updatedDescription) => {
    // Update the sequence in the SequenceController
    sequenceController.updateSequence(sequenceId, { name: updatedName, processName: updatedProcessName, description: updatedDescription });

    // Update the treeData state
    const updateSequenceInTree = (node) => {
      if (node.id === sequenceId) {
        node.name = updatedName;
        node.processName = updatedProcessName;
        node.description = updatedDescription;

      } else if (node.children) {
        node.children.forEach(updateSequenceInTree);
      }
    };
    updateSequenceInTree(treeData);
    setTreeData({ ...treeData });
  };

  const handleRemoveSequence = (sequenceId: string) => {
    // Remove the sequence from the treeData state
    const removeSequenceFromTree = (node: TreeNode) => {
      if (node.children) {
        node.children = node.children.filter((child) => child.id !== sequenceId);
        node.children.forEach(removeSequenceFromTree);
      }
    };
    removeSequenceFromTree(treeData);
    setTreeData({ ...treeData });
  };



  return {
    handleAddChildSequenceFromIdea,
    handleAddChildSequence,
    handleUpdateSequence,
    handleRemoveSequence,
    handleUpdateTreeData,
    searchSequences,
    findParentNodeById,
    findNodeById,

  }


}